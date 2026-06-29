// ============================================
// LUXUDIES - Paytm Server Utilities
// Implements checksum via Node crypto directly
// to avoid paytmchecksum package key-length bugs
// ============================================

import crypto from 'crypto';

// ---- Config ----

export interface PaytmConfig {
  mid: string;
  merchantKey: string;
  website: string;
  environment: 'STAGING' | 'PRODUCTION';
}

export const getPaytmConfig = (): PaytmConfig => {
  const mid = process.env.PAYTM_MID;
  const merchantKey = process.env.PAYTM_MERCHANT_KEY;
  const website = process.env.PAYTM_WEBSITE || 'WEBSTAGING';

  if (!mid || !merchantKey) {
    throw new Error(
      'Paytm credentials missing! Set PAYTM_MID and PAYTM_MERCHANT_KEY in your environment variables.'
    );
  }

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

// ---- Checksum helpers (mirrors paytmchecksum library logic) ----

function encrypt(data: string, key: string): string {
  // Key must be exactly 16 bytes (AES-128-CBC)
  // paytmchecksum uses UTF-8 encoding of the key string directly.
  const keyBuffer = Buffer.from(key, 'binary').slice(0, 16);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt(data: string, key: string): string {
  const keyBuffer = Buffer.from(key, 'binary').slice(0, 16);
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, iv);
  let decrypted = decipher.update(data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateSalt(length = 4): string {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Generates Paytm Checksum Hash
 */
export async function generateChecksum(params: Record<string, any>, merchantKey: string): Promise<string> {
  // Sort params, concat values
  const sortedKeys = Object.keys(params).sort();
  const str = sortedKeys.map((k) => {
    const val = params[k];
    return val === null || val === undefined ? 'null' : String(val);
  }).join('|');
  const salt = generateSalt();
  const hashInput = `${str}|${salt}`;
  const sha256 = crypto.createHash('sha256').update(hashInput).digest('hex');
  const checksum = encrypt(`${sha256}${salt}`, merchantKey);
  return checksum;
}

/**
 * Generates checksum for a JSON body string (for initiateTransaction API)
 */
export async function generateChecksumByString(body: string, merchantKey: string): Promise<string> {
  const salt = generateSalt();
  const sha256 = crypto.createHash('sha256').update(`${body}|${salt}`).digest('hex');
  const checksum = encrypt(`${sha256}${salt}`, merchantKey);
  return checksum;
}

/**
 * Verifies Paytm Checksum Hash (for callback verification)
 */
export function verifyChecksum(params: Record<string, string>, merchantKey: string, checksum: string): boolean {
  try {
    const decrypted = decrypt(checksum, merchantKey);
    const salt = decrypted.slice(-4);
    const hash = decrypted.slice(0, -4);

    const sortedKeys = Object.keys(params).sort();
    const str = sortedKeys.map((k) => {
      const val = params[k];
      return val === null || val === undefined ? 'null' : String(val);
    }).join('|');

    const expectedHash = crypto.createHash('sha256').update(`${str}|${salt}`).digest('hex');
    return hash === expectedHash;
  } catch {
    return false;
  }
}
