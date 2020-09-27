package pushserver

import (
	"crypto/ecdsa"
	"crypto/rand"
	"errors"
	"fmt"
	"io"
	"sync/atomic"
	"time"
)

// ErrUnencrypted is an error returned when a message wasn't encrypted while required to do so.
var ErrUnencrypted = errors.New("Message should be encrypted but was not")

// ErrUnauthorized represents an Unauthorized error defined in RFC8292 4.2
// https://tools.ietf.org/html/rfc8292#section-4-2
var ErrUnauthorized = errors.New("Message was not authenticated while it is required (RFC8292 4.2., Unauthorized)")

// ErrForbidden represents a Forbidden error defined in RFC8292 4.2
// https://tools.ietf.org/html/rfc8292#section-4-2
var ErrForbidden = errors.New("Message was not authenticated while it is required (RFC8292 4.2., Forbidden)")

// Subscription is a subscription.
type Subscription struct {
	ID            string
	NumericID     int64
	Audience      string
	active        uint32
	channel       chan *Message
	nextMessageID int64

	// RejectUnencryptedMessage enables error when unencrypted messages (RFC8291) are pushed.
	RejectUnencryptedMessage bool

	// user agent data used for RFC8291
	privateKey   *ecKey
	sharedSecret []byte

	// application server data used for RFC8292
	vapidPublicKey *ecdsa.PublicKey
}

// SubscriptionOption is a struct represents application/webpush-options+json
// https://tools.ietf.org/html/rfc8292#section-4.1
type SubscriptionOption struct {
	Vapid string `json:"vapid,omitempty"`
}

// ErrUnrestricted is an error returned when a subscription is required to be restricted, but isn't restricted.
var ErrUnrestricted = errors.New("unrestricted subscription is not permitted (RFC8292 Section 4.)")

func newSubscription(id int64, options *SubscriptionOption, audience string, rejectUnencryptedMessage bool, rejectUnrestrictedSubscription bool) (*Subscription, error) {
	// Generate user agent ECDH key for RFC8291
	// https://tools.ietf.org/html/rfc8291#section-3.1
	privateKey, err := newEcKey()
	if err != nil {
		return nil, err
	}

	// Generate user agent authentication secret for RFC8291
	// https://tools.ietf.org/html/rfc8291#section-3.2
	sharedSecret := make([]byte, 16)
	_, err = io.ReadFull(rand.Reader, sharedSecret)
	if err != nil {
		return nil, err
	}

	// Save a ECDSA public key for RFC8292
	// https://tools.ietf.org/html/rfc8292#section-4.1
	var vapidPublicKey *ecdsa.PublicKey
	if options != nil {
		if len(options.Vapid) > 0 {
			unmarshaledKey, err := unmarshalEncodedEcPublicKey(options.Vapid)
			if err != nil {
				return nil, err
			}
			vapidPublicKey = unmarshaledKey.intoEcdsaPublicKey()
		}
	}

	if rejectUnrestrictedSubscription && vapidPublicKey == nil {
		return nil, ErrUnrestricted
	}

	return &Subscription{
		ID:                       saltedIDHash("sub", 0, id),
		NumericID:                id,
		Audience:                 audience,
		active:                   1,
		channel:                  make(chan *Message, 30),
		nextMessageID:            1,
		privateKey:               privateKey,
		sharedSecret:             sharedSecret,
		vapidPublicKey:           vapidPublicKey,
		RejectUnencryptedMessage: rejectUnencryptedMessage,
	}, nil
}

// GetPath returns a HTTP path for this subscription (push message request)
func (sub *Subscription) GetPath() string {
	return fmt.Sprintf("/push/%s", sub.ID)
}

// GetURL returns a HTTP URL for this subscription (push message request)
func (sub *Subscription) GetURL() string {
	return fmt.Sprintf("%s/push/%s", sub.Audience, sub.ID)
}

// GetChannel returns a chan to receive pushed message
func (sub *Subscription) GetChannel() <-chan *Message {
	return sub.channel
}

// GetP256DH returns a user-agent p256dh parameter; https://tools.ietf.org/html/rfc8291#section-2
func (sub *Subscription) GetP256DH() string {
	return sub.privateKey.publicKey.Encode()
}

// GetAuth returns a user-agent auth parameter; https://tools.ietf.org/html/rfc8291#section-2
func (sub *Subscription) GetAuth() string {
	return encodeBase64(sub.sharedSecret)
}

// IsActive returns true when a subscription is still active and not expired. See also Expire()
func (sub *Subscription) IsActive() bool {
	return atomic.LoadUint32(&sub.active) > 0
}

// Expire invalidates a subscription and lets it inactive. Inactive push resource will return 404 at Service.
func (sub *Subscription) Expire() {
	atomic.StoreUint32(&sub.active, 0)
}

// IsRestricted returns true when a subscription is restricted to a specific application server with VAPID
// https://tools.ietf.org/html/rfc8292#section-4
func (sub *Subscription) IsRestricted() bool {
	return sub.vapidPublicKey != nil
}

// Authenticate verifies a VAPID authorization header. Returns an error when unauthorised.
func (sub *Subscription) Authenticate(authorization string) error {
	auth := authentication{
		publicKey:           sub.vapidPublicKey,
		authorizationHeader: authorization,
		audience:            sub.Audience,
		time:                time.Now(),
	}
	return auth.authenticate()
}

func (sub *Subscription) newMessageID() string {
	nextID := atomic.AddInt64(&sub.nextMessageID, 1)
	return saltedIDHash(`msg`, sub.NumericID, nextID)
}

// pushMessage decodes and pushes a given message to channel. VAPID authenticate must be done before calling pushMessage.
// This method return error in case of decryption failure, however it should be discarded
// as RFC8291 requests a user agent to do so. https://tools.ietf.org/html/rfc8291#section-4
// At least, it must not turn into a error response of a push service.
func (sub *Subscription) pushMessage(rawMessage *RawMessage) (*Message, error) {
	msg, err := newMessageForSubscription(sub, rawMessage)
	if err != nil {
		return nil, err
	}
	if sub.RejectUnencryptedMessage && msg.WasUnencrypted() {
		return nil, ErrUnencrypted
	}
	sub.channel <- msg
	return msg, nil
}
