import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/portfolio-v2',
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
