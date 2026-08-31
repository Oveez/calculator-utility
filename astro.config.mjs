import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'calculator';
const basePath = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS ? `/${repositoryName}` : '/');
const siteUrl = process.env.SITE_URL ?? 'https://calculatorutility.tech';

export default defineConfig({
  site: siteUrl,
  base: basePath,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
});
