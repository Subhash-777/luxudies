// ============================================
// LUXUDIES - Paytm Server Configuration
// ============================================

import PaytmChecksum from 'paytmchecksum';

/**
 * Paytm Configuration Interface
 */
export interface PaytmConfig {
  mid: string;
  merchantKey: string;
  website: string;
  channelId: string;
  industryTypeId: string;
  environment: 'STAGING' | 'PRODUCTION';
}

/**
 * Get Paytm Configuration based on environment variables
 */
export const getPaytmConfig = (): PaytmConfig => {
  const mid = process.env.PAYTM_MID;
  const merchantKey = process.env.PAYTM_MERCHANT_KEY;
  const website = process.env.PAYTM_WEBSITE || 'WEBSTAGING'; // DEFAULT for production
  
  // Staging environment usually uses WEBSTAGING, Retail, WAP
  // Production uses DEFAULT, Retail, WEB/WAP
  
  if (!mid || !merchantKey) {
    console.warn('Paytm environment variables are missing! Using mock configuration for build/dev.');
  }

  return {
    mid: mid || 'MOCK_MID_FOR_BUILD',
    merchantKey: merchantKey || 'MOCK_KEY_FOR_BUILD',
    website: website,
    channelId: 'WEB',
    industryTypeId: 'Retail',
    environment: website === 'WEBSTAGING' ? 'STAGING' : 'PRODUCTION',
  };
};

/**
 * Get the appropriate Paytm host URL based on environment
 */
export const getPaytmHost = (config: PaytmConfig) => {
  return config.environment === 'PRODUCTION' 
    ? 'securegw.paytm.in' 
    : 'securegw-stage.paytm.in';
};

/**
 * Generates Paytm Checksum for API requests
 */
export const generateChecksum = async (params: any, merchantKey: string): Promise<string> => {
  try {
    const checksum = await PaytmChecksum.generateSignature(JSON.stringify(params), merchantKey);
    return checksum;
  } catch (error) {
    console.error('Error generating Paytm checksum:', error);
    throw new Error('Failed to generate checksum');
  }
};

/**
 * Verifies Paytm Checksum from API responses
 */
export const verifyChecksum = (params: any, merchantKey: string, checksum: string): boolean => {
  try {
    return PaytmChecksum.verifySignature(params, merchantKey, checksum);
  } catch (error) {
    console.error('Error verifying Paytm checksum:', error);
    return false;
  }
};
