package pushserver

import "fmt"

// RawMessage is a raw push message (might be encrypted) given at HTTP Push Request.
type RawMessage struct {
	Body  []byte
	TTL   int64
	Topic string

	Encoding string
}

const aes128gcm = "aes128gcm"

func (rm *RawMessage) isEncrypted() bool {
	return rm.Encoding == aes128gcm
}

// Message is a message
type Message struct {
	ID    string
	Body  []byte
	TTL   int64
	Topic string

	audience     string
	wasEncrypted bool
}

func newMessageForSubscription(sub *Subscription, rawMessage *RawMessage) (*Message, error) {
	isEncrypted := rawMessage.isEncrypted()

	body := rawMessage.Body
	if isEncrypted {
		d := &decryption{
			data:       body,
			privateKey: sub.privateKey,
			secret:     sub.sharedSecret,
		}
		plaintext, err := d.decrypt()
		if err != nil {
			return nil, err
		}
		body = plaintext
	}

	msg := &Message{
		ID:           sub.newMessageID(),
		Body:         body,
		TTL:          rawMessage.TTL,
		Topic:        rawMessage.Topic,
		wasEncrypted: isEncrypted,
		audience:     sub.Audience,
	}
	return msg, nil
}

// WasUnencrypted returns true when a message was not pushed with a encryption (RFC8291) and has a content.
func (m *Message) WasUnencrypted() bool {
	return !m.wasEncrypted && len(m.Body) > 0
}

// GetPath returns a HTTP path for this message
func (m *Message) GetPath() string {
	return fmt.Sprintf(`/message/%s`, m.ID)
}

// GetURL returns a HTTP URL for this message
func (m *Message) GetURL() string {
	return fmt.Sprintf(`%s/push/%s`, m.audience, m.ID)
}
