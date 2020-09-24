package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/isucon/isucon10-final/benchmarker/pushserver"
)

type subscriber struct {
	Endpoint string `json:"endpoint"`
	P256DH   string `json:"p256dh"`
	Auth     string `json:"auth"`
}

func main() {
	flag.Parse()
	vapidPublicKey, err := ioutil.ReadFile("./vapid_public.txt")
	if err != nil {
		panic(err)
	}

	service := pushserver.NewService("https://localhost:11001", 10)
	service.OnInvalidPush = onInvalidPush

	for i := 0; i < 5; i++ {
		// these flags MUST be true.
		s, err := service.Subscribe(&pushserver.SubscriptionOption{Vapid: string(vapidPublicKey[:])}, true, true)
		if err != nil {
			panic(err)
		}

		sr := &subscriber{
			Endpoint: s.GetURL(),
			P256DH:   s.GetP256DH(),
			Auth:     s.GetAuth(),
		}
		srJSON, err := json.Marshal(sr)
		if err != nil {
			panic(err)
		}
		ioutil.WriteFile(fmt.Sprintf("./sub_%d.json", i), srJSON, 0644)

		go receivePush(i, s)
	}

	http.ListenAndServeTLS("localhost:11001", "./https_crt.pem", "./https_key.pem", service.HTTP())
}

func receivePush(i int, sub *pushserver.Subscription) {
	for {
		msg := <-sub.GetChannel()
		if msg == nil {
			break
		}
		fmt.Printf("%d/%s: id=%v, ttl=%v, topic=%v, unencrypted=%v, body=%v\n", i, sub.ID, msg.ID, msg.TTL, msg.Topic, msg.WasUnencrypted(), string(msg.Body[:]))
	}
}

func onInvalidPush(id string, err error) {
	fmt.Printf("%s: err %+v\n", id, err)
}
