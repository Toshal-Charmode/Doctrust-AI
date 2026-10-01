import crypto from 'crypto';
import config from '../config/env.js';

// Derive or fallback a 32-byte encryption key for biometric templates
const BIOMETRIC_SECRET = process.env.BIOMETRIC_SECRET || config.jwtSecret || 'docutrust-biometric-secret-key-32b';
const CIPHER_KEY = crypto.createHash('sha256').update(BIOMETRIC_SECRET).digest();
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypts a facial embedding vector or template into a secure ciphertext string.
 * Uses AES-256-GCM with a unique 12-byte initialization vector (IV) per encryption.
 * Output format: iv:authTag:encryptedData (hex encoded)
 */
export function encryptFaceTemplate(embeddingArray) {
  if (!Array.isArray(embeddingArray) || embeddingArray.length === 0) {
    throw new Error('Invalid embedding vector provided for encryption');
  }

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, iv);
  
  const payload = JSON.stringify(embeddingArray);
  let encrypted = cipher.update(payload, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an encrypted face template back into a numeric embedding array.
 * Validates GCM auth tag to ensure ciphertext integrity and authenticity.
 */
export function decryptFaceTemplate(encryptedString) {
  if (!encryptedString || typeof encryptedString !== 'string') {
    throw new Error('Invalid encrypted face template');
  }

  const parts = encryptedString.split(':');
  if (parts.length !== 3) {
    throw new Error('Corrupted or malformed face template structure');
  }

  const [ivHex, authTagHex, encryptedData] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, CIPHER_KEY, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  const embedding = JSON.parse(decrypted);
  if (!Array.isArray(embedding)) {
    throw new Error('Decrypted template is not a valid array');
  }

  return embedding;
}

/**
 * Generates a cryptographically secure, high-entropy challenge ID.
 */
export function generateChallengeId() {
  return 'fac_' + crypto.randomBytes(24).toString('hex');
}

export default {
  encryptFaceTemplate,
  decryptFaceTemplate,
  generateChallengeId,
};
