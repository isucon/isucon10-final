package pushserver

import (
	"crypto/ecdsa"
	"errors"
	"fmt"
	"net/url"
	"regexp"
	"time"

	"gopkg.in/square/go-jose.v2/jwt"
)

type authentication struct {
	publicKey           *ecdsa.PublicKey
	authorizationHeader string
	audience            string
	time                time.Time

	t string
	k string
}

func (auth *authentication) authenticate() error {
	//glog.V(1).Infof("authenticate: %v", auth)
	// https://tools.ietf.org/html/rfc8292#section-4.2
	if auth.publicKey == nil {
		return nil
	}

	if err := auth.fetchParameters(); err != nil {
		//glog.V(1).Infof("fetchParameters err: %v", err)
		return err
	}

	if err := auth.verifyKey(); err != nil {
		//glog.V(1).Infof("verifyKey err: %v", err)
		return err
	}

	if err := auth.verifyToken(); err != nil {
		//glog.V(1).Infof("verifyToken err: %v", err)
		return err
	}

	return nil
}

// ErrUnexpectedToken is an error returned when given pubilc key doesn't comply RFC8292 or doesn't match to the known expected public key.
var ErrUnexpectedToken = errors.New(`VAPID key validation failure`)

func (auth *authentication) verifyKey() error {
	key, err := unmarshalEncodedEcPublicKey(auth.k)
	if err != nil {
		return fmt.Errorf("%w: cannot unmarshal auth.k", err)
	}
	if !auth.publicKey.Equal(key.intoEcdsaPublicKey()) {
		//glog.V(1).Infof("verifyKey equality error: actual=%v | expected=%v", key, auth.publicKey)
		return fmt.Errorf(`%w: vapid key doesn't match to the known key`, ErrUnexpectedToken)
	}

	return nil
}

func (auth *authentication) verifyToken() error {
	token, err := jwt.ParseSigned(auth.t)
	if err != nil {
		return err
	}

	claims := jwt.Claims{}
	if err := token.Claims(auth.publicKey, &claims); err != nil {
		return err
	}

	// https://tools.ietf.org/html/rfc8292#section-2
	if err := claims.Validate(jwt.Expected{Audience: jwt.Audience{auth.audience}, Time: auth.time}); err != nil {
		u, err2 := url.Parse(auth.audience)
		if err2 != nil {
			return err
		}
		audienceWithoutPort := fmt.Sprintf("%s://%s", u.Scheme, u.Hostname())
		if err := claims.Validate(jwt.Expected{Audience: jwt.Audience{audienceWithoutPort}, Time: auth.time}); err != nil {
			//glog.V(1).Infof("cannot validate jwt: %v (auth.audience=%s, audience2=%s)", claims, auth.audience, audienceWithoutPort)
			return err
		}
	}

	return nil
}

var authorizationFieldRegexp = regexp.MustCompile(`(?i)([^\s=]+)=([^\s,]+)\s*(?:,\s*|$)`)
var authorizationHeaderRegexp = regexp.MustCompile(`(?i)^vapid\s+(.+)$`)

// ErrUnexpectedAuthorizationHeader is an error when encountered unexpected, invalid Authorization header.
var ErrUnexpectedAuthorizationHeader = errors.New(`invalid or unexpected Authorization header`)

func (auth *authentication) fetchParameters() (err error) {
	// https://tools.ietf.org/html/rfc8292#section-2
	// https://tools.ietf.org/html/rfc8292#section-6.2
	// https://tools.ietf.org/html/rfc7235#appendix-C (`credentials`)

	err = ErrUnexpectedAuthorizationHeader
	headerMatch := authorizationHeaderRegexp.FindStringSubmatch(auth.authorizationHeader)
	if len(headerMatch) == 0 {
		return
	}

	fieldMatches := authorizationFieldRegexp.FindAllStringSubmatch(headerMatch[1], -1)
	for _, field := range fieldMatches {
		if len(field) != 3 {
			continue
		}
		switch field[1] {
		case `t`, `T`:
			auth.t = field[2]
		case `k`, `K`:
			auth.k = field[2]
		}
		if len(auth.t) > 0 && len(auth.k) > 0 {
			err = nil
			break
		}
	}
	return
}
