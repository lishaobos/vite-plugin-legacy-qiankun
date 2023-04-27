import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'
import legacy from '@vitejs/plugin-legacy'
import { base } from '../config'

// https://vitejs.dev/config/
export default defineConfig({
  base: base ? `${base}9526/` : '/',
  build: {
    outDir: '../dist/react'
  },
  server: {
    open: true,
    port: 9526,
  },
  plugins: [
    react({
      fastRefresh: false
    }),
    legacy({
      targets: {
        "chrome": "58",
      }
    }),
    legacyQiankun({
      name: 'vite_react',
      devSandbox: true
    })
  ]
})
