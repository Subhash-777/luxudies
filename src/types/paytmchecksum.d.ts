declare module 'paytmchecksum' {
  export function generateSignature(params: string | Record<string, string>, key: string): Promise<string>;
  export function verifySignature(params: string | Record<string, string>, key: string, checksum: string): boolean;
  export function generateSignatureByString(params: string, key: string): Promise<string>;
  export function verifySignatureByString(params: string, key: string, checksum: string): boolean;
}
