// @luca-core/encryption
// AES-256-GCM encryption for LucaVault field-level encryption
// Uses Web Crypto API — works in Cloudflare Workers, browsers, and Node.js 18+

const ALGORITHM = 'AES-GCM'
const KEY_LENGTH = 256
const IV_LENGTH = 12 // 96 bits for GCM

// ─────────────────────────────────────────
// Key management
// ─────────────────────────────────────────

export async function importMasterKey(base64Key: string): Promise<CryptoKey> {
  const keyBytes = base64ToBytes(base64Key)
  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: ALGORITHM },
    true, // exportable for HKDF derivation
    ['encrypt', 'decrypt']
  )
}

export async function deriveEntityKey(
  masterKey: CryptoKey,
  entityId: string
): Promise<CryptoKey> {
  const masterKeyBytes = await crypto.subtle.exportKey('raw', masterKey)

  const hkdfKey = await crypto.subtle.importKey(
    'raw',
    masterKeyBytes,
    { name: 'HKDF' },
    false,
    ['deriveKey']
  )

  const entityIdBytes = new TextEncoder().encode(entityId)

  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: entityIdBytes,
      info: new TextEncoder().encode('lucavault-entity-key-v1'),
    },
    hkdfKey,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function deriveSystemKey(masterKey: CryptoKey): Promise<CryptoKey> {
  return deriveEntityKey(masterKey, 'system-key-v1')
}

// ─────────────────────────────────────────
// Encryption / Decryption
// ─────────────────────────────────────────

export async function encrypt(key: CryptoKey, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH))
  const plaintextBytes = new TextEncoder().encode(plaintext)

  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    plaintextBytes
  )

  return `${bytesToBase64(iv)}:${bytesToBase64(new Uint8Array(ciphertext))}`
}

export async function decrypt(key: CryptoKey, encrypted: string): Promise<string> {
  const [ivBase64, ciphertextBase64] = encrypted.split(':')
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted value format')
  }

  const iv = base64ToBytes(ivBase64)
  const ciphertext = base64ToBytes(ciphertextBase64)

  const plaintext = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  )

  return new TextDecoder().decode(plaintext)
}

export async function encryptNullable(
  key: CryptoKey,
  value: string | null | undefined
): Promise<string | null> {
  if (value == null) return null
  return encrypt(key, value)
}

export async function decryptNullable(
  key: CryptoKey,
  value: string | null | undefined
): Promise<string | null> {
  if (value == null) return null
  return decrypt(key, value)
}

// ─────────────────────────────────────────
// Hashing (for searchable fields like email)
// ─────────────────────────────────────────

export async function hashValue(masterKey: CryptoKey, value: string): Promise<string> {
  const masterKeyBytes = await crypto.subtle.exportKey('raw', masterKey)

  const hmacKey = await crypto.subtle.importKey(
    'raw',
    masterKeyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const valueBytes = new TextEncoder().encode(value.toLowerCase().trim())
  const signature = await crypto.subtle.sign('HMAC', hmacKey, valueBytes)

  return bytesToHex(new Uint8Array(signature))
}

// ─────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
