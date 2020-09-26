package pushserver

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"io"
	"sync"
)

func decodeBase64(key string) ([]byte, error) {
	bytes, err := base64.URLEncoding.WithPadding(base64.NoPadding).DecodeString(key)
	if err == nil {
		return bytes, nil
	}

	return base64.StdEncoding.WithPadding(base64.NoPadding).DecodeString(key)
}

func encodeBase64(key []byte) string {
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(key)
}

var idSalt []byte
var initonce sync.Once

func boot() {
	generateIDSalt()
}

func generateIDSalt() {
	newSalt := make([]byte, 16)
	n, err := io.ReadFull(rand.Reader, newSalt)
	if err != nil || n != len(newSalt) {
		panic("cannot generate id salt")
	}
	idSalt = newSalt
}

func saltedIDHash(model string, a int64, b int64) string {
	initonce.Do(boot)
	hash := sha256.Sum256([]byte(fmt.Sprintf("%s\t%s\t%d\t%d", idSalt, model, a, b)))
	return encodeBase64(hash[:])
}
