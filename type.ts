import type { Plugin } from 'vite'

declare type Lifecyle = {
  bootstrap<T>(): T
  mount<T>(): T
  unmount<T>(): T
}

declare type PluginOptions = {
  name: string
  // dev: boolean
}

declare type MicroApp = {
  publicPath: string
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string | undefined
  __POWERED_BY_QIANKUN__: string | undefined
}

declare function getMicroApp(options: PluginOptions): MicroApp

declare function createLifecyle(appName: string): void

declare function legacyQiankun(appName: string): Plugin[]

export {
  Lifecyle,
  PluginOptions,
  getMicroApp,
  createLifecyle,
  legacyQiankun
}