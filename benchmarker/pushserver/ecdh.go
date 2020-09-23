package pushserver

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"fmt"
	"math/big"
)

type ecPublicKey struct {
	x *big.Int
	y *big.Int
}

type ecKey struct {
	publicKey  ecPublicKey
	privateKey []byte
}

func (pub *ecPublicKey) intoEcdsaPublicKey() *ecdsa.PublicKey {
	return &ecdsa.PublicKey{
		Curve: elliptic.P256(),
		X:     pub.x,
		Y:     pub.y,
	}
}

func (pub *ecPublicKey) Encode() string {
	return encodeBase64(elliptic.Marshal(elliptic.P256(), pub.x, pub.y))
}

func (p *ecKey) ecdhSecret(publicKey *ecPublicKey) *big.Int {
	x, _ := elliptic.P256().ScalarMult(publicKey.x, publicKey.y, p.privateKey)
	return x
}

func newEcKey() (*ecKey, error) {
	privateKey, x, y, err := elliptic.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		return nil, err
	}
	return &ecKey{privateKey: privateKey, publicKey: ecPublicKey{x, y}}, nil
}

func unmarshalEcPublicKey(bytes []byte) (*ecPublicKey, error) {
	x, y := elliptic.Unmarshal(elliptic.P256(), bytes)
	if x == nil {
		return nil, fmt.Errorf("Cannot unmarshal given P-256 encoded public key")
	}

	return &ecPublicKey{x, y}, nil
}

func unmarshalEncodedEcPublicKey(key string) (*ecPublicKey, error) {
	bytes, err := decodeBase64(key)
	if err != nil {
		return nil, fmt.Errorf("Cannot decode given P-256 encoded public key: %w", err)
	}

	return unmarshalEcPublicKey(bytes)
}
