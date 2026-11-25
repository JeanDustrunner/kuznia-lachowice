import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// BASE_PATH is set by the GitHub Pages workflow (e.g. /kuznia-lachowice/); locally the site is served from /.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/main.tsx', 'src/**/*.test.{ts,tsx}'],
    },
  },
})
