import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
  resolve: {
    alias: {
      // Point to the CJS files directly so Vite can transform them
      'use-sync-external-store/shim/with-selector.js': path.resolve(
        __dirname,
        'node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js'
      ),
      'use-sync-external-store/shim/index.js': path.resolve(
        __dirname,
        'node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js'
      ),
    },
  },
  ssr: {
    noExternal: ['use-sync-external-store'],
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    },
  },
})
