// ============================================
// LUXUDIES - Paytm Utilities
// Implements the EXACT paytmchecksum@1.5.1 algorithm:
//   - AES-128-CBC with MD5(merchantKey) as the key
//   - ZERO IV (Buffer.alloc(16, 0)) — NOT random
//   - Output is plain base64 of encrypted data (no IV prepended)
// ============================================

import crypto from 'crypto';

// ─── Config ──────────────────────────────────────────────────────────────────

export interface PaytmConfig {
  mid: string;
  merchantKey: string;
  website: string;
  environment: 'STAGING' | 'PRODUCTION';
}

export const getPaytmConfig = (): PaytmConfig => {
  const mid = process.env.PAYTM_MID?.trim();
  const merchantKey = process.env.PAYTM_MERCHANT_KEY?.trim();
  const website = process.env.PAYTM_WEBSITE?.trim() || 'WEBSTAGING';

  if (!mid) throw new Error('Missing environment variable: PAYTM_MID');
  if (!merchantKey) throw new Error('Missing environment variable: PAYTM_MERCHANT_KEY');

  return {
    mid,
    merchantKey,
    website,
    environment: website === 'WEBSTAGING' ? 'STAGING' : 'PRODUCTION',
  };
};

export const getPaytmHost = (config: PaytmConfig): string =>
  config.environment === 'PRODUCTION'
    ? 'securegw.paytm.in'
    : 'securegw-stage.paytm.in';

// ─── Core Crypto ─────────────────────────────────────────────────────────────
// Mirrors paytmchecksum@1.5.1 exactly.

function deriveAesKey(merchantKey: string): Buffer {
  // Always produces 16 bytes regardless of merchantKey length or content.
  return crypto.createHash('md5').update(merchantKey).digest();
}

/** AES-128-CBC encrypt with zero IV → plain base64 (no IV prepended) */
function encrypt(data: string, merchantKey: string): string {
  const key = deriveAesKey(merchantKey);
  const iv = Buffer.alloc(16, 0); // Zero IV — matches paytmchecksum library
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

/** AES-128-CBC decrypt with zero IV */
function decrypt(ciphertext: string, merchantKey: string): string {
  const key = deriveAesKey(merchantKey);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateSalt(length = 4): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const bytes = crypto.randomBytes(length);
  let salt = '';
  for (let i = 0; i < length; i++) {
    salt += chars[bytes[i] % chars.length];
  }
  return salt;
}

// ─── Public Checksum Functions ────────────────────────────────────────────────

/**
 * Generate signature for the initiateTransaction REST API.
 * Called with: JSON.stringify(requestBody)
 *
 * Algorithm:
 *   salt       = 4 random alphanumeric chars
 *   sha256     = SHA256(bodyJsonString + "|" + salt)
 *   signature  = AES_encrypt(sha256 + salt, merchantKey)
 */
export async function generateChecksumByString(
  bodyString: string,
  merchantKey: string
): Promise<string> {
  const salt = generateSalt(4);
  const sha256 = crypto
    .createHash('sha256')
    .update(`${bodyString}|${salt}`)
    .digest('hex');
  return encrypt(sha256 + salt, merchantKey);
}

/**
 * Generate checksum for legacy key-value param APIs.
 */
export async function generateChecksum(
  params: Record<string, any>,
  merchantKey: string
): Promise<string> {
  const sortedKeys = Object.keys(params).sort();
  const paramStr = sortedKeys
    .map((k) =>
      params[k] === null || params[k] === undefined ? 'null' : String(params[k])
    )
    .join('|');
  const salt = generateSalt(4);
  const sha256 = crypto
    .createHash('sha256')
    .update(`${paramStr}|${salt}`)
    .digest('hex');
  return encrypt(sha256 + salt, merchantKey);
}

/**
 * Verify the checksum returned in Paytm's callback POST.
 */
export function verifyChecksum(
  params: Record<string, string>,
  merchantKey: string,
  checksum: string
): boolean {
  try {
    const decrypted = decrypt(checksum, merchantKey);
    const salt = decrypted.slice(-4);
    const receivedHash = decrypted.slice(0, -4);

    const sortedKeys = Object.keys(params).sort();
    const paramStr = sortedKeys
      .map((k) =>
        params[k] === null || params[k] === undefined ? 'null' : String(params[k])
      )
      .join('|');

    const expectedHash = crypto
      .createHash('sha256')
      .update(`${paramStr}|${salt}`)
      .digest('hex');

    return receivedHash === expectedHash;
  } catch {
    return false;
  }
}
