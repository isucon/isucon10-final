package pushserver

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/mux"
)

// Service is a web app of RFC8030, RFC8292 mock implementation
type Service struct {
	Origin string

	subscriptionsLock  sync.RWMutex
	subscriptions      map[string]*Subscription
	nextSubscriptionID int64

	OnInvalidPush func(id string, err error)
}

// NewService returns Service
func NewService(origin string, capa int64) *Service {
	s := &Service{
		Origin:        origin,
		subscriptions: make(map[string]*Subscription, capa),
		OnInvalidPush: func(id string, err error) {},
	}
	return s
}

// Subscribe returns a new push subscription. where encodedVapidPublicKey is an optional application server's base64 encoded VAPID public key.
// Error is only returned on cryptographic RNG failure or invalid option (VAPID public key) is given.
func (s *Service) Subscribe(option *SubscriptionOption, rejectUnencryptedMessage bool, rejectUnrestrictedSubscription bool) (*Subscription, error) {
	s.subscriptionsLock.Lock()
	defer s.subscriptionsLock.Unlock()

	for {
		id := s.nextSubscriptionID
		s.nextSubscriptionID++

		sub, err := newSubscription(id, option, s.Origin, rejectUnencryptedMessage, rejectUnrestrictedSubscription)
		if err != nil {
			return nil, err
		}

		if _, ok := s.subscriptions[sub.ID]; ok {
			continue
		}

		s.subscriptions[sub.ID] = sub
		return sub, nil
	}
}

// GetSubscriptionByID finds a Subscription by its ID. nil when not exists.
func (s *Service) GetSubscriptionByID(id string) *Subscription {
	s.subscriptionsLock.RLock()
	defer s.subscriptionsLock.RUnlock()
	return s.subscriptions[id]
}

// HTTP returns a mux.Router to serve push server endpoints.
func (s *Service) HTTP() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/push/{id}", s.handlePush)
	return r
}

// https://tools.ietf.org/html/rfc8030#section-4
// func (s* Server) handleSubscribe(rw http.ResponseWriter, r *http.Request) {
// }

// ErrSubscriptionNotFound is an error only used for OnInvalidPush callback argument. Passed when received a push to nonexistent push subscription.
var ErrSubscriptionNotFound = errors.New("No subscription found")

// ErrSubscriptionInactive is an error only used for OnInvalidPush callback argument. Passed when received a push to inactive push subscription.
var ErrSubscriptionInactive = errors.New("Push attempt to expired subscription")

// https://tools.ietf.org/html/rfc8030#section-5
func (s *Service) handlePush(w http.ResponseWriter, r *http.Request) {
	subscriptionID := mux.Vars(r)["id"]
	subscription := s.GetSubscriptionByID(subscriptionID)
	if subscription == nil {
		s.OnInvalidPush(subscriptionID, ErrSubscriptionNotFound)
		http.NotFound(w, r)
		return
	}
	if !subscription.IsActive() {
		s.OnInvalidPush(subscriptionID, ErrSubscriptionInactive)
		http.NotFound(w, r)
		return
	}

	authorization := r.Header.Get(`Authorization`)
	if err := subscription.Authenticate(authorization); err != nil {
		s.OnInvalidPush(subscriptionID, err)
		if errors.Is(err, ErrUnexpectedToken) {
			http.Error(w, `Forbidden`, http.StatusForbidden)
		} else {
			http.Error(w, `Unauthorized`, http.StatusUnauthorized)
		}
		return
	}

	raw := &RawMessage{
		Topic:    r.Header.Get("Topic"),
		Encoding: r.Header.Get("Content-Encoding"),
		TTL:      0,
	}
	if ttl, err := strconv.ParseInt(r.Header.Get("TTL"), 10, 64); err == nil {
		raw.TTL = ttl
	} else {
		http.Error(w, `Bad Request`, http.StatusBadRequest)
		w.Write([]byte("Invalid TTL header"))
		return
	}

	if r.Body != nil {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			panic(err)
		}
		raw.Body = body
	}

	message, err := subscription.pushMessage(raw)
	if err != nil {
		s.OnInvalidPush(subscriptionID, err)
		if errors.Is(err, ErrUnencrypted) {
			http.Error(w, `Bad Request`, http.StatusBadRequest)
			w.Write([]byte(`Unencrypted push messages are not allowed (use RFC8291)`))
			return
		} else {
			// Other errors are likely decryption failure. Do nothing as a push server.
			// RFC8291 suggests a user agent to do nothing for invalid messages.
			// Also this handler is a part of push server, note that a push server doesn't know the message is valid or invalid at a recipient  user-agent end.

			message = &Message{ID: subscription.newMessageID(), audience: subscription.Audience}
		}
	}

	w.Header().Set("Location", message.GetURL())
	if r.Header.Get("Prefer") == "respond-async" {
		w.Header().Add("Link", fmt.Sprintf(`</receipt-notification/%s>; rel="urn:ietf:params:push:receipt"`, message.ID))
		w.WriteHeader(http.StatusAccepted)
	} else {
		w.WriteHeader(http.StatusCreated)
	}

}
