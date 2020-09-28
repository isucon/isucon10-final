package pushserver

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/elliptic"
	"crypto/sha256"
	"encoding/binary"
	"errors"
	"fmt"
	"io"

	"golang.org/x/crypto/hkdf"
)

type encryptionDerivedKey struct {
	ikmInfo    []byte
	ecdhSecret []byte
	ikm        []byte
	cek        []byte
	nonce      []byte
}

// ErrInvalidData is an error returned when encountered an invalid data.
var ErrInvalidData = errors.New("Invalid data")

// decryption is a decryptor for data encrypted using RFC8291 and RFC8188
type decryption struct {
	data       []byte
	privateKey *ecKey
	secret     []byte

	headerIDLen uint8
	headerRs    uint32
}

func (d *decryption) decrypt() ([]byte, error) {
	if err := d.assertDataLength(); err != nil {
		return []byte{}, err
	}

	key, err := d.deriveKey(false)
	if err != nil {
		return []byte{}, err
	}

	ciphertext := d.record()

	plaintext, err := encryptionOpenAesgcm(key, ciphertext)
	if err != nil {
		retErr := fmt.Errorf(
			"failed to decrypt (pkey=%x, keyid=%x, dh=%x, info=%x, secret=%x, ikm=%x, cek=%x, nonce=%x): %w",
			elliptic.Marshal(elliptic.P256(), d.privateKey.publicKey.x, d.privateKey.publicKey.y),
			d.keyID(),
			key.ecdhSecret,
			key.ikmInfo,
			d.secret,
			key.ikm,
			key.cek,
			key.nonce,
			err,
		)

		// Retry with short ecdh shared secret for invalid clients
		// https://github.com/SherClockHolmes/webpush-go/blob/af9d240f5def12dc7c23a73999092c9d937be7a5/webpush.go#L105
		key, err := d.deriveKey(true)
		if err != nil {
			return []byte{}, retErr
		}
		plaintext, err = encryptionOpenAesgcm(key, ciphertext)
		if err != nil {
			return []byte{}, retErr
		}
	}

	return trimRFC8291Padding(plaintext), nil
}

func encryptionOpenAesgcm(key *encryptionDerivedKey, ciphertext []byte) ([]byte, error) {
	alg, err := aes.NewCipher(key.cek)
	if err != nil {
		return []byte{}, err
	}
	gcm, err := cipher.NewGCM(alg)
	if err != nil {
		return []byte{}, err
	}

	plaintext, err := gcm.Open(nil, key.nonce, ciphertext, nil)
	return plaintext, err
}

// https://tools.ietf.org/html/rfc8188#section-2.1
// https://tools.ietf.org/html/rfc8291#section-4
func (d *decryption) assertDataLength() error {
	if len(d.data) < 21 {
		return fmt.Errorf("%w: content-coding header is too short (RFC8188 Section 2.1)", ErrInvalidData)
	}

	if len(d.data) < int(21+d.idLen()) {
		return fmt.Errorf("%w: content-coding header is too short for the given idlen (RFC8188 Section 2.1)", ErrInvalidData)
	}

	if d.recordSize() < 18 {
		return fmt.Errorf("%w: record size (rs) is too short (RFC8188 Section 2.1)", ErrInvalidData)
	}

	if d.recordSize() > 4096 {
		return fmt.Errorf("%w: record size (rs) is too long (RFC8291 Section 4)", ErrInvalidData)
	}

	if d.idLen() != 65 {
		return fmt.Errorf("%w: keyid length (idLen) must be 65 (RFC8291 Section 4)", ErrInvalidData)
	}

	// Per RFC8291 this expects a single record of RFC8188, therefore it is always a "last record".
	// So, value should not be longer than record size. but shorter than record size is permitted.
	if len(d.data) > int(21+uint32(d.idLen())+d.recordSize()) {
		return fmt.Errorf("%w: data is longer than specified at rs (RFC8188 Section 2.1)", ErrInvalidData)
	}

	return nil
}

func (d *decryption) readHeader() {
	// https://tools.ietf.org/html/rfc8188#section-2.1
	if d.headerIDLen > 0 && d.headerRs > 0 {
		return
	}
	r := bytes.NewReader(d.data[16 : 16+5])
	if err := binary.Read(r, binary.BigEndian, &d.headerRs); err != nil {
		panic(err)
	}
	if err := binary.Read(r, binary.BigEndian, &d.headerIDLen); err != nil {
		panic(err)
	}
}

func (d *decryption) idLen() uint8 {
	d.readHeader()
	return d.headerIDLen
}

func (d *decryption) recordSize() uint32 {
	d.readHeader()
	return d.headerRs
}

func (d *decryption) salt() []byte {
	// https://tools.ietf.org/html/rfc8188#section-2.1
	return d.data[0:16]
}

func (d *decryption) keyID() []byte {
	// https://tools.ietf.org/html/rfc8188#section-2.1
	return d.data[21 : 21+uint32(d.idLen())]
}

func (d *decryption) record() []byte {
	// https://tools.ietf.org/html/rfc8188#section-2.1
	idLen := uint32(d.idLen())
	return d.data[21+idLen:]
}

// https://tools.ietf.org/html/rfc8291#section-3.1
func (d *decryption) deriveKey(short bool) (*encryptionDerivedKey, error) {
	// https://tools.ietf.org/html/rfc8291#section-4
	asPublicKey, err := unmarshalEcPublicKey(d.keyID())
	if err != nil {
		return nil, err
	}

	// https://tools.ietf.org/html/rfc8291#section-3.1
	ecdhSecret := d.privateKey.ecdhSecret(asPublicKey, short)

	// https://tools.ietf.org/html/rfc8291#section-3.3
	infoBuf := bytes.NewBuffer([]byte("WebPush: info\x00"))
	infoBuf.Write(elliptic.Marshal(elliptic.P256(), d.privateKey.publicKey.x, d.privateKey.publicKey.y))
	infoBuf.Write(d.keyID()) // infoBuf.Write(elliptic.Marshal(elliptic.P256(), asPublicKey.x, asPublicKey.y))
	ikm, err := getKeyFromHKDF(hkdf.New(sha256.New, ecdhSecret, d.secret, infoBuf.Bytes()), 32)
	if err != nil {
		return nil, err
	}

	// https://tools.ietf.org/html/rfc8188#section-2.2
	cek, err := getKeyFromHKDF(hkdf.New(sha256.New, ikm, d.salt(), []byte("Content-Encoding: aes128gcm\x00")), 16)
	if err != nil {
		return nil, err
	}

	// https://tools.ietf.org/html/rfc8188#section-2.3
	nonce, err := getKeyFromHKDF(hkdf.New(sha256.New, ikm, d.salt(), []byte("Content-Encoding: nonce\x00")), 12)
	if err != nil {
		return nil, err
	}

	return &encryptionDerivedKey{ikmInfo: infoBuf.Bytes(), ecdhSecret: ecdhSecret, ikm: ikm, cek: cek, nonce: nonce}, nil
}

func getKeyFromHKDF(reader io.Reader, l int) ([]byte, error) {
	buf := make([]byte, l)
	n, err := io.ReadFull(reader, buf)
	if err != nil {
		return []byte{}, err
	}
	if n != len(buf) {
		return []byte{}, errors.New("cannot read required length from hkdf")
	}
	return buf, nil
}

func trimRFC8291Padding(data []byte) []byte {
	// https://tools.ietf.org/html/rfc8188#section-2.3
	// https://tools.ietf.org/html/rfc8291#section-4
	// Last byte must be 0x00 or 0x02. Other values are not permitted in RFC8291.
	// if 0x00, find first 0x00 and trim with 0x02. if 0x02, remove 0x02 and return.
	last := data[len(data)-1]
	if last == 0 {
		index := bytes.Index(data, []byte{2, 0})
		if index == -1 {
			return []byte{}
		}
		return data[0:index]
	} else if last == 2 {
		return data[0 : len(data)-2]
	} else {
		return []byte{}
	}
}
