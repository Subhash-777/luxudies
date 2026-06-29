// ============================================
// LUXUDIES - Paytm Utilities
// Uses Node.js built-in crypto (no npm package)
// Matches the official paytmchecksum algorithm
// ============================================

import crypto from 'crypto';

// ─── Config ─────────────────────────────────────────────────────────────────

export interface PaytmConfig {
  mid: string;
  merchantKey: string;
  website: string;
  environment: 'STAGING' | 'PRODUCTION';
}

export const getPaytmConfig = (): PaytmConfig => {
  const mid = process.env.PAYTM_MID?.trim();
  const merchantKey = process.env.PAYTM_MERCHANT_KEY?.trim();
  const website = (process.env.PAYTM_WEBSITE?.trim()) || 'WEBSTAGING';

  if (!mid) throw new Error('Missing env var: PAYTM_MID');
  if (!merchantKey) throw new Error('Missing env var: PAYTM_MERCHANT_KEY');

  return {
    mid,
    merchantKey,
    website,
    environment: website === 'WEBSTAGING' ? 'STAGING' : 'PRODUCTION',
  };
};

export const getPaytmHost = (config: PaytmConfig) =>
  config.environment === 'PRODUCTION'
    ? 'securegw.paytm.in'
    : 'securegw-stage.paytm.in';

// ─── Core Crypto (mirrors official paytmchecksum library exactly) ─────────────
// The paytmchecksum library derives the AES key by MD5-hashing the merchant key.
// MD5 always returns 16 bytes → perfectly sized for AES-128-CBC, regardless of
// the merchant key length or any special characters it may contain.

function deriveAesKey(merchantKey: string): Buffer {
  return crypto.createHash('md5').update(merchantKey).digest();
}

function generateSalt(len = 4): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let salt = '';
  const bytes = crypto.randomBytes(len);
  for (let i = 0; i < len; i++) {
    salt += chars[bytes[i] % chars.length];
  }
  return salt;
}

function encryptAES(plaintext: string, merchantKey: string): string {
  const aesKey = deriveAesKey(merchantKey); // always 16 bytes
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-128-cbc', aesKey, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  // paytmchecksum format: base64(iv) + base64(encrypted)
  return iv.toString('base64') + encrypted.toString('base64');
}

function decryptAES(ciphertext: string, merchantKey: string): string {
  const aesKey = deriveAesKey(merchantKey);
  // First 24 chars of base64 = 16 bytes IV (16 bytes → 24 base64 chars)
  const ivB64 = ciphertext.substring(0, 24);
  const dataB64 = ciphertext.substring(24);
  const iv = Buffer.from(ivB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Generate checksum for a JSON string body
 * (Used by the initiateTransaction API)
 */
export async function generateChecksumByString(
  body: string,
  merchantKey: string
): Promise<string> {
  const salt = generateSalt(4);
  const sha256 = crypto.createHash('sha256').update(`${body}|${salt}`).digest('hex');
  return encryptAES(sha256 + salt, merchantKey);
}

/**
 * Generate checksum for a key-value params object
 * (Used by legacy APIs)
 */
export async function generateChecksum(
  params: Record<string, any>,
  merchantKey: string
): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys
    .map((k) => (params[k] === null || params[k] === undefined ? 'null' : String(params[k])))
    .join('|');
  const salt = generateSalt(4);
  const sha256 = crypto.createHash('sha256').update(`${paramStr}|${salt}`).digest('hex');
  return encryptAES(sha256 + salt, merchantKey);
}

/**
 * Verify checksum from Paytm callback
 */
export function verifyChecksum(
  params: Record<string, string>,
  merchantKey: string,
  checksum: string
): boolean {
  try {
    const decrypted = decryptAES(checksum, merchantKey);
    const salt = decrypted.slice(-4);
    const receivedHash = decrypted.slice(0, -4);

    const sortedKeys = Object.keys(params).sort();
    const paramStr = sortedKeys
      .map((k) => (params[k] === null || params[k] === undefined ? 'null' : String(params[k])))
      .join('|');

    const expectedHash = crypto.createHash('sha256').update(`${paramStr}|${salt}`).digest('hex');
    return receivedHash === expectedHash;
  } catch {
    return false;
  }
}
