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

// SEC1: https://www.secg.org/sec1-v2.pdf
// Section 6.1. Elliptic Curve Diffie-Hellman Scheme
func (p *ecKey) ecdhSecret(publicKey *ecPublicKey, short bool) []byte {
	curve := elliptic.P256()
	x, _ := curve.ScalarMult(publicKey.x, publicKey.y, p.privateKey)

	if short {
		// Workaround for invalid clients https://github.com/SherClockHolmes/webpush-go/blob/af9d240f5def12dc7c23a73999092c9d937be7a5/webpush.go#L105
		return x.Bytes()
	}

	// SEC1: 6.1.3. Key Agreement Operation
	//   Action 2. Convert $$ z $$ to an octet string the conversion routine specified in Section 2.3.5.
	//     Section 2.3.5. Field-Element-to-Octet-String Conversion
	//       > where $$ mlen = log_2q/8 $$
	//       Section 2.3.7. Integer-to-Octet-String Conversion
	mlen := curve.Params().BitSize / 8
	buf := make([]byte, mlen)
	x.FillBytes(buf)
	return buf
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
