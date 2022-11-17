import vue from '@vitejs/plugin-vue2'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'
import { base } from '../config'

export default {
  base: base ? `${base}9527/` : '/',
  build: {
    outDir: '../dist/vue2'
  },
  server: {
    open: true,
    port: 9527
  },
  plugins: [
    vue(),
    legacy(),
    legacyQiankun({ name: 'vite_vue2' })
  ]
}