/**
 * Pure TypeScript URL & Query String Utilities
 * Parse, build, clean tracking parameters, and construct UTM marketing links.
 */

export interface UrlParam {
  key: string;
  value: string;
  decodedValue: string;
}

export function parseUrlParameters(urlString: string): { hostname: string; pathname: string; params: UrlParam[]; hash: string } {
  try {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    const params: UrlParam[] = [];
    url.searchParams.forEach((val, key) => {
      params.push({
        key,
        value: val,
        decodedValue: decodeURIComponent(val),
      });
    });
    return {
      hostname: url.hostname,
      pathname: url.pathname,
      params,
      hash: url.hash,
    };
  } catch (e) {
    // If not a full URL, attempt query string parse
    const queryString = urlString.includes('?') ? urlString.split('?')[1] : urlString;
    const searchParams = new URLSearchParams(queryString);
    const params: UrlParam[] = [];
    searchParams.forEach((val, key) => {
      params.push({
        key,
        value: val,
        decodedValue: decodeURIComponent(val),
      });
    });
    return { hostname: '', pathname: '', params, hash: '' };
  }
}

/**
 * Clean URL: Strip tracking parameters (UTM, Facebook, Google click IDs, etc.)
 */
const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid', 'twclid', 'zanpid', 'mc_cid', 'mc_eid',
  'igshid', '_ga', '_gl', 'ref', 'source'
]);

export function cleanUrlTracking(urlString: string): string {
  try {
    const url = new URL(urlString.startsWith('http') ? urlString : `https://${urlString}`);
    const cleanParams = new URLSearchParams();
    url.searchParams.forEach((val, key) => {
      if (!TRACKING_PARAMS.has(key.toLowerCase()) && !key.toLowerCase().startsWith('utm_')) {
        cleanParams.append(key, val);
      }
    });

    const query = cleanParams.toString();
    const finalQuery = query ? `?${query}` : '';
    return `${url.origin}${url.pathname}${finalQuery}${url.hash}`;
  } catch (e) {
    return urlString;
  }
}

/**
 * UTM Builder
 */
export function buildUtmUrl(baseUrl: string, utm: { source: string; medium?: string; campaign?: string; term?: string; content?: string }): string {
  try {
    const url = new URL(baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`);
    if (utm.source) url.searchParams.set('utm_source', utm.source);
    if (utm.medium) url.searchParams.set('utm_medium', utm.medium);
    if (utm.campaign) url.searchParams.set('utm_campaign', utm.campaign);
    if (utm.term) url.searchParams.set('utm_term', utm.term);
    if (utm.content) url.searchParams.set('utm_content', utm.content);
    return url.toString();
  } catch (e) {
    return baseUrl;
  }
}
