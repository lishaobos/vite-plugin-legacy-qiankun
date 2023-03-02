import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'
import { base } from '../config'

export default {
  base: base ? `${base}9528/` : '/',
  build: {
    outDir: '../dist/vue3'
  },
  server: {
    open: true,
    port: 9528
  },
  plugins: [
    vue(),
    legacy({
      targets: {
        "chrome": "58",
      }
    }),
    legacyQiankun({ name: 'vite_vue3' }),
  ]
}