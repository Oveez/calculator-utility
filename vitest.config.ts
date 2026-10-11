import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/*-engine.test.ts', 'tests/all-countries-parity.test.ts'],
    globals: true,
  },
});
