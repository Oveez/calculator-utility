/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly BASE_PATH?: string;
  readonly GITHUB_REPOSITORY?: string;
  readonly GITHUB_ACTIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
