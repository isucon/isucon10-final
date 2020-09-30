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
pub struct VapidKey {
    pub encoding_key: jsonwebtoken::EncodingKey,
    pub public_key_for_push_header: String,
}
impl VapidKey {
    pub fn open<P>(path: P) -> Option<VapidKey>
    where
        P: AsRef<std::path::Path>,
    {
        let pem_content = match std::fs::File::open(&path) {
            Ok(mut file) => {
                use std::io::Read;
                let mut buf = Vec::new();
                file.read_to_end(&mut buf)
                    .expect("Failed to read WebPush VAPID private key");
                buf
            }
            Err(e) => {
                log::warn!(
                    "Failed to open WebPush VAPID private key {}: {:?}",
                    path.as_ref().display(),
                    e
                );
                return None;
            }
        };
        let ec_key = openssl::ec::EcKey::private_key_from_pem(&pem_content);
        if let Err(e) = ec_key {
            log::warn!(
                "Failed to parse WebPush VAPID private key {}: {:?}",
                path.as_ref().display(),
                e
            );
            return None;
        }
        let ec_key = ec_key.unwrap();

        let mut ctx = openssl::bn::BigNumContext::new().unwrap();
        let public_key = ec_key.public_key();
        let key_bytes = public_key
            .to_bytes(
                ec_key.group(),
                openssl::ec::PointConversionForm::UNCOMPRESSED,
                &mut ctx,
            )
            .unwrap();
        let public_key_for_push_header = data_encoding::BASE64URL_NOPAD.encode(&key_bytes);

        let pkey =
            openssl::pkey::PKey::from_ec_key(ec_key).expect("Failed to construct PKey from EcKey");
        let pkcs8 = pkey
            .private_key_to_pem_pkcs8()
            .expect("Failed to get private key from PKey");
        let encoding_key = jsonwebtoken::EncodingKey::from_ec_pem(&pkcs8)
            .expect("Failed to construct EncodingKey from PKey");

        Some(VapidKey {
            encoding_key,
            public_key_for_push_header,
        })
    }
}

pub struct WebPushSigner<'a> {
    encoding_key: &'a jsonwebtoken::EncodingKey,
    public_key_for_push_header: &'a str,
}
impl<'a> WebPushSigner<'a> {
    pub fn new(
        encoding_key: &'a jsonwebtoken::EncodingKey,
        public_key_for_push_header: &'a str,
    ) -> Self {
        Self {
            encoding_key,
            public_key_for_push_header,
        }
    }
    pub fn sign(
        &self,
        endpoint: &url::Url,
        subject: &str,
    ) -> Result<reqwest::header::HeaderMap, jsonwebtoken::errors::Error> {
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
        let jwt = jsonwebtoken::encode(&jwt_header, &claims, &self.encoding_key)?;

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
                jwt, self.public_key_for_push_header
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
