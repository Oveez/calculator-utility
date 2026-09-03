/**
 * Pure TypeScript Developer Utility Functions
 * Zero-dependency, client-side algorithms for JSON, Base64, Hashes, UUIDs, Timestamps, and Cron expressions.
 */

// Simple fast MD5 implementation in pure TypeScript (for offline client-side hashing)
export function md5(string: string): string {
  function rotateLeft(lValue: number, iShiftBits: number) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function addUnsigned(lX: number, lY: number) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    if (lX4 | lY4) {
      if (lResult & 0x40000000) return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      return lResult ^ 0x40000000 ^ lX8 ^ lY8;
    }
    return lResult ^ lX8 ^ lY8;
  }
  function F(x: number, y: number, z: number) { return (x & y) | (~x & z); }
  function G(x: number, y: number, z: number) { return (x & z) | (y & ~z); }
  function H(x: number, y: number, z: number) { return x ^ y ^ z; }
  function I(x: number, y: number, z: number) { return y ^ (x | ~z); }
  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(str: string) {
    let lWordCount;
    const lMessageLength = str.length;
    const lNumberOfWordsTemp1 = lMessageLength + 8;
    const lNumberOfWordsTemp2 = (lNumberOfWordsTemp1 - (lNumberOfWordsTemp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWordsTemp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue: number) {
    let wordToHexValue = '', wordToHexValueTemp = '', lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValueTemp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValueTemp.substr(wordToHexValueTemp.length - 2, 2);
    }
    return wordToHexValue;
  }

  const x = convertToWordArray(unescape(encodeURIComponent(string)));
  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;
  const S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  const S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  const S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  const S41 = 6, S42 = 10, S43 = 15, S44 = 21;

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d;
    a = FF(a, b, c, d, x[k + 0] || 0, S11, 0xd76aa478);
    d = FF(d, a, b, c, x[k + 1] || 0, S12, 0xe8c7b756);
    c = FF(c, d, a, b, x[k + 2] || 0, S13, 0x242070db);
    b = FF(b, c, d, a, x[k + 3] || 0, S14, 0xc1bdceee);
    a = FF(a, b, c, d, x[k + 4] || 0, S11, 0xf57c0faf);
    d = FF(d, a, b, c, x[k + 5] || 0, S12, 0x4787c62a);
    c = FF(c, d, a, b, x[k + 6] || 0, S13, 0xa8304613);
    b = FF(b, c, d, a, x[k + 7] || 0, S14, 0xfd469501);
    a = FF(a, b, c, d, x[k + 8] || 0, S11, 0x698098d8);
    d = FF(d, a, b, c, x[k + 9] || 0, S12, 0x8b44f7af);
    c = FF(c, d, a, b, x[k + 10] || 0, S13, 0xffff5bb1);
    b = FF(b, c, d, a, x[k + 11] || 0, S14, 0x895cd7be);
    a = FF(a, b, c, d, x[k + 12] || 0, S11, 0x6b901122);
    d = FF(d, a, b, c, x[k + 13] || 0, S12, 0xfd987193);
    c = FF(c, d, a, b, x[k + 14] || 0, S13, 0xa679438e);
    b = FF(b, c, d, a, x[k + 15] || 0, S14, 0x49b40821);

    a = GG(a, b, c, d, x[k + 1] || 0, S21, 0xf61e2562);
    d = GG(d, a, b, c, x[k + 6] || 0, S22, 0xc040b340);
    c = GG(c, d, a, b, x[k + 11] || 0, S23, 0x265e5a51);
    b = GG(b, c, d, a, x[k + 0] || 0, S24, 0xe9b6c7aa);
    a = GG(a, b, c, d, x[k + 5] || 0, S21, 0xd62f105d);
    d = GG(d, a, b, c, x[k + 10] || 0, S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15] || 0, S23, 0xd8a1e681);
    b = GG(b, c, d, a, x[k + 4] || 0, S24, 0xe7d3fbc8);
    a = GG(a, b, c, d, x[k + 9] || 0, S21, 0x21e1cde6);
    d = GG(d, a, b, c, x[k + 14] || 0, S22, 0xc33707d6);
    c = GG(c, d, a, b, x[k + 3] || 0, S23, 0xf4d50d87);
    b = GG(b, c, d, a, x[k + 8] || 0, S24, 0x455a14ed);
    a = GG(a, b, c, d, x[k + 13] || 0, S21, 0xa9e3e905);
    d = GG(d, a, b, c, x[k + 2] || 0, S22, 0xfcefa3f8);
    c = GG(c, d, a, b, x[k + 7] || 0, S23, 0x676f02d9);
    b = GG(b, c, d, a, x[k + 12] || 0, S24, 0x8d2a4c8a);

    a = HH(a, b, c, d, x[k + 5] || 0, S31, 0xfffa3942);
    d = HH(d, a, b, c, x[k + 8] || 0, S32, 0x8771f681);
    c = HH(c, d, a, b, x[k + 11] || 0, S33, 0x6d9d6122);
    b = HH(b, c, d, a, x[k + 14] || 0, S34, 0xfde5380c);
    a = HH(a, b, c, d, x[k + 1] || 0, S31, 0xa4beea44);
    d = HH(d, a, b, c, x[k + 4] || 0, S32, 0x4bdecfa9);
    c = HH(c, d, a, b, x[k + 7] || 0, S33, 0xf6bb4b60);
    b = HH(b, c, d, a, x[k + 10] || 0, S34, 0xbebfbc70);
    a = HH(a, b, c, d, x[k + 13] || 0, S31, 0x289b7ec6);
    d = HH(d, a, b, c, x[k + 0] || 0, S32, 0xeaa127fa);
    c = HH(c, d, a, b, x[k + 3] || 0, S33, 0xd4ef3085);
    b = HH(b, c, d, a, x[k + 6] || 0, S34, 0x4881d05);
    a = HH(a, b, c, d, x[k + 9] || 0, S31, 0xd9d4d039);
    d = HH(d, a, b, c, x[k + 12] || 0, S32, 0xe6db99e5);
    c = HH(c, d, a, b, x[k + 15] || 0, S33, 0x1fa27cf8);
    b = HH(b, c, d, a, x[k + 2] || 0, S34, 0xc4ac5665);

    a = II(a, b, c, d, x[k + 0] || 0, S41, 0xf4292244);
    d = II(d, a, b, c, x[k + 7] || 0, S42, 0x432aff97);
    c = II(c, d, a, b, x[k + 14] || 0, S43, 0xab9423a7);
    b = II(b, c, d, a, x[k + 5] || 0, S44, 0xfc93a039);
    a = II(a, b, c, d, x[k + 12] || 0, S41, 0x655b59c3);
    d = II(d, a, b, c, x[k + 3] || 0, S42, 0x8f0ccc92);
    c = II(c, d, a, b, x[k + 10] || 0, S43, 0xffeff47d);
    b = II(b, c, d, a, x[k + 1] || 0, S44, 0x85845dd1);
    a = II(a, b, c, d, x[k + 8] || 0, S41, 0x6fa87e4f);
    d = II(d, a, b, c, x[k + 15] || 0, S42, 0xfe2ce6e0);
    c = II(c, d, a, b, x[k + 6] || 0, S43, 0xa3014314);
    b = II(b, c, d, a, x[k + 13] || 0, S44, 0x4e0811a1);
    a = II(a, b, c, d, x[k + 4] || 0, S41, 0xf7537e82);
    d = II(d, a, b, c, x[k + 11] || 0, S42, 0xbd3af235);
    c = II(c, d, a, b, x[k + 2] || 0, S43, 0x2ad7d2bb);
    b = II(b, c, d, a, x[k + 9] || 0, S44, 0xeb86d391);

    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase();
}

/**
 * Native Web Crypto Hash Generator
 */
export async function calculateWebHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512'): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Format JSON with custom indentation
 */
export function formatJson(input: string, indent: number | string = 2): { success: boolean; result: string; error?: string; line?: number; column?: number } {
  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed, null, indent),
    };
  } catch (err: any) {
    let line: number | undefined;
    let column: number | undefined;
    const match = err.message.match(/at position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const lines = input.substring(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    return {
      success: false,
      result: '',
      error: err.message,
      line,
      column,
    };
  }
}

/**
 * Minify JSON
 */
export function minifyJson(input: string): { success: boolean; result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return {
      success: true,
      result: JSON.stringify(parsed),
    };
  } catch (err: any) {
    return { success: false, result: '', error: err.message };
  }
}

/**
 * JWT Decoder (Header + Payload)
 */
export function decodeJwt(token: string): { success: boolean; header?: any; payload?: any; error?: string } {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT format: Token must have 3 dot-separated parts (Header.Payload.Signature).' };
    }
    const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
    const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return {
      success: true,
      header: JSON.parse(headerStr),
      payload: JSON.parse(payloadStr),
    };
  } catch (e: any) {
    return { success: false, error: `Failed to decode JWT: ${e.message}` };
  }
}

/**
 * Unix Timestamp Converter
 */
export function parseUnixTimestamp(ts: number | string, isMs = false) {
  const num = typeof ts === 'string' ? parseFloat(ts) : ts;
  if (isNaN(num)) return null;
  const date = new Date(isMs ? num : num * 1000);
  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime(),
    relative: getRelativeTimeString(date),
  };
}

function getRelativeTimeString(date: Date): string {
  const diffSec = Math.floor((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffSec) < 3600) return rtf.format(Math.floor(diffSec / 60), 'minute');
  if (Math.abs(diffSec) < 86400) return rtf.format(Math.floor(diffSec / 3600), 'hour');
  return rtf.format(Math.floor(diffSec / 86400), 'day');
}

/**
 * Base64 Converter
 */
export function base64Encode(str: string, urlSafe = false): string {
  const b64 = btoa(unescape(encodeURIComponent(str)));
  return urlSafe ? b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') : b64;
}

export function base64Decode(str: string): string {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return decodeURIComponent(escape(atob(b64)));
}
