const normalizedBasePath = normalizeBasePath(import.meta.env.BASE_PATH ?? '/');

function normalizeBasePath(basePath: string): string {
  if (basePath === '/' || basePath === '') {
    return '/';
  }

  const prefixed = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return prefixed.endsWith('/') ? prefixed : `${prefixed}/`;
}

export const siteName = 'Calculator Utility';
export const siteTagline = 'Fast static calculators and everyday utility tools.';
export const siteUrl = import.meta.env.SITE_URL ?? 'https://calculatorutility.tech';
export const basePath = normalizedBasePath;

export function withBasePath(path = '/'): string {
  if (basePath === '/') {
    return path;
  }

  if (path === '/') {
    return basePath;
  }

  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${basePath}${normalizedPath}`;
}

export function toAbsoluteUrl(path = '/'): string {
  return new URL(withBasePath(path), siteUrl).toString();
}
