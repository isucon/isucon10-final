use byteorder::ByteOrder;
use ring::aead::BoundKey;
use ring::rand::SecureRandom;

struct HKDFKey(usize);
impl ring::hkdf::KeyType for HKDFKey {
    fn len(&self) -> usize {
        self.0
    }
}

struct ECENonceSequence([u8; 12]);
impl ring::aead::NonceSequence for ECENonceSequence {
    fn advance(&mut self) -> Result<ring::aead::Nonce, ring::error::Unspecified> {
        ring::aead::Nonce::try_assume_unique_for_key(&self.0)
    }
}

#[derive(serde::Serialize)]
struct JWTClaims {
    aud: String,
    exp: u64,
    sub: String,
}

#[derive(Debug)]
pub enum WebPushError {
    OpensslError(openssl::error::ErrorStack),
    JWTError(jsonwebtoken::errors::Error),
}
impl From<openssl::error::ErrorStack> for WebPushError {
    fn from(e: openssl::error::ErrorStack) -> Self {
        Self::OpensslError(e)
    }
}
impl From<jsonwebtoken::errors::Error> for WebPushError {
    fn from(e: jsonwebtoken::errors::Error) -> Self {
        Self::JWTError(e)
    }
}
impl std::fmt::Display for WebPushError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> Result<(), std::fmt::Error> {
        match self {
            Self::OpensslError(e) => write!(f, "OpenSSL error: {}", e),
            Self::JWTError(e) => write!(f, "JWT error: {}", e),
        }
    }
}
impl std::error::Error for WebPushError {}

pub struct WebPushSigner {
    ec_key: openssl::ec::EcKey<openssl::pkey::Private>,
}
impl WebPushSigner {
    pub fn new(pem: &[u8]) -> Result<Self, WebPushError> {
        Ok(Self {
            ec_key: openssl::ec::EcKey::private_key_from_pem(&pem)?,
        })
    }
    pub fn sign(
        &self,
        endpoint: &url::Url,
        subject: &str,
    ) -> Result<reqwest::header::HeaderMap, WebPushError> {
        let pkey = openssl::pkey::PKey::from_ec_key(self.ec_key.clone())?;
        let vapid_key = jsonwebtoken::EncodingKey::from_ec_pem(&pkey.private_key_to_pem_pkcs8()?)?;
        let jwt_header = jsonwebtoken::Header::new(jsonwebtoken::Algorithm::ES256);
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let claims = JWTClaims {
            aud: format!("{}://{}", endpoint.scheme(), endpoint.host().unwrap()),
            sub: subject.to_owned(),
            exp: now + 24 * 60 * 60,
        };
        let jwt = jsonwebtoken::encode(&jwt_header, &claims, &vapid_key)?;
        let public_key = self.ec_key.public_key();
        let mut ctx = openssl::bn::BigNumContext::new()?;
        let public_key_bytes = public_key.to_bytes(
            self.ec_key.group(),
            openssl::ec::PointConversionForm::UNCOMPRESSED,
            &mut ctx,
        )?;
        let public_key_for_push_header =
            base64::encode_config(public_key_bytes, base64::URL_SAFE_NO_PAD);

        let mut headers = reqwest::header::HeaderMap::new();
        headers.insert(
            reqwest::header::CONTENT_TYPE,
            reqwest::header::HeaderValue::from_static("application/octet-stream"),
        );
        headers.insert(
            reqwest::header::HeaderName::from_static("ttl"),
            reqwest::header::HeaderValue::from_static("2419200"),
        );
        headers.insert(
            reqwest::header::HeaderName::from_static("urgency"),
            reqwest::header::HeaderValue::from_static("normal"),
        );
        headers.insert(
            reqwest::header::CONTENT_ENCODING,
            reqwest::header::HeaderValue::from_static("aes128gcm"),
        );
        headers.insert(
            reqwest::header::AUTHORIZATION,
            reqwest::header::HeaderValue::from_str(&format!(
                "vapid t={},k={}",
                jwt, public_key_for_push_header
            ))
            .unwrap(),
        );

        Ok(headers)
    }
}

pub fn build_payload(
    client_auth_token: &[u8],
    client_public_key: &[u8],
    message: &str,
) -> Result<Vec<u8>, ring::error::Unspecified> {
    let rng = ring::rand::SystemRandom::new();
    let mut salt = [0; 16];
    rng.fill(&mut salt)?;

    let server_private_key =
        ring::agreement::EphemeralPrivateKey::generate(&ring::agreement::ECDH_P256, &rng)?;
    let server_public_key = server_private_key.compute_public_key()?;
    let client_public_key =
        ring::agreement::UnparsedPublicKey::new(&ring::agreement::ECDH_P256, client_public_key);
    let shared_secret = ring::agreement::agree_ephemeral(
        server_private_key,
        &client_public_key,
        ring::error::Unspecified,
        |shared_secret| Ok(shared_secret.to_vec()),
    )?;

    let mut info: Vec<u8> = Vec::with_capacity(144);
    info.extend_from_slice(b"WebPush: info\0");
    info.extend_from_slice(client_public_key.bytes());
    info.extend_from_slice(server_public_key.as_ref());

    let mut ikm = [0; 32];
    do_hkdf(
        &mut ikm,
        &client_auth_token,
        &shared_secret,
        info.as_slice(),
    )?;
    let mut cek = [0; 16];
    do_hkdf(&mut cek, &salt, &ikm, b"Content-Encoding: aes128gcm\0")?;
    let mut nonce = [0; 12];
    do_hkdf(&mut nonce, &salt, &ikm, b"Content-Encoding: nonce\0")?;
    log::trace!(
        "salt={:?} ikm={:?} cek={:?} nonce={:?}",
        salt,
        ikm,
        cek,
        nonce
    );

    let unbound_key = ring::aead::UnboundKey::new(&ring::aead::AES_128_GCM, &cek)?;
    let mut sealing_key = ring::aead::SealingKey::new(unbound_key, ECENonceSequence(nonce));
    let mut ciphertext = message.as_bytes().to_vec();
    ciphertext.push(0x02);
    ciphertext.push(0x00);
    sealing_key.seal_in_place_append_tag(ring::aead::Aad::empty(), &mut ciphertext)?;

    let mut payload = salt.to_vec();
    let mut buf = [0; 4];
    byteorder::NetworkEndian::write_u32(&mut buf, ciphertext.len() as u32);
    payload.extend_from_slice(&buf);
    payload.push(server_public_key.as_ref().len() as u8);
    payload.extend_from_slice(server_public_key.as_ref());
    payload.extend(ciphertext);
    Ok(payload)
}

fn do_hkdf(
    buf: &mut [u8],
    salt_value: &[u8],
    secret: &[u8],
    info: &[u8],
) -> Result<(), ring::error::Unspecified> {
    let salt = ring::hkdf::Salt::new(ring::hkdf::HKDF_SHA256, salt_value);
    let prk = salt.extract(secret);
    let info = [info];
    let okm = prk.expand(&info, HKDFKey(buf.len()))?;
    okm.fill(buf)
}
