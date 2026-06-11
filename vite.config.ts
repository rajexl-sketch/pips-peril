import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1600
  },
  server: {
    // Bind to loopback only so the dev server is never exposed to the
    // local network (defense-in-depth for the esbuild dev-server advisory).
    host: 'localhost',
    port: 5173
  }
});
