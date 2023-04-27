import type { Plugin } from 'vite'
import { tokenizer } from 'acorn'
import MagicString from 'magic-string'

type PluginOptions = {
  name: string
  devSandbox?: boolean
}

type Lifecyle = {
  bootstrap(): Promise<any> | void
  mount(props: any): Promise<any> | void
  unmount(props: any): Promise<any> | void
  update?(props: any): Promise<any> | void
}

type MicroApp = Partial<{
  publicPath: string
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string
  __POWERED_BY_QIANKUN__: string
  lifecyle: Lifecyle
}>

const scriptModuleReg = /<script(\s+)type=('|")module\2(.*)>([^<]*)<\/script>/g

const scriptNoModuleReg = /<script(\s+)nomodule(.*)>([^<]*)<\/script>/g

const createAttrReg = (attr: string) => new RegExp(attr + "=('|\")([^>\\s]+)\\1")

const replaceScript = (script: string) => `<!-- replace by vite-plugin-legacy-qiankun ${script} -->`

const hasProtocol = (url: string) => url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://')

export const convertVariable = (code: string, from: string, to: string) => {
  const s = new MagicString(code)
  const tokens = tokenizer(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
  })

  for (const token of tokens) {
    if (token.value === from && !['.', '"', "'"].includes(code[token.start - 1])) {
      s.overwrite(token.start, token.end, to)
    }
  }

  return s.toString()
}

export const getMicroApp = (appName: string): MicroApp => {
  const global = (0, eval)('window')
  return (global.legacyQiankun && global.legacyQiankun[appName]) || {}
}

export const createLifecyle = (name: string, lifecyle: Lifecyle) => {
  const global = (0, eval)('window')
  global.legacyQiankun = global.legacyQiankun || {}
  global.legacyQiankun[name] = global.legacyQiankun[name] || {}
  global.legacyQiankun[name].lifecyle = lifecyle
}

export const createCtx = ({ name, devSandbox = false }: PluginOptions) => {
  const createScriptStr = (scriptContent: string) => `<script>\n(function (){\nconst global = (0, eval)('window')\nconst name = '${name}'\n${scriptContent}})()\n</script>`

  const preInjectStr = `
    const proxy = global.proxy
    let publicPath = (proxy && proxy.__INJECTED_PUBLIC_PATH_BY_QIANKUN__) || ''
    publicPath = publicPath.slice(0, publicPath.length - 1)
    global.legacyQiankun = global.legacyQiankun || {}
    global.legacyQiankun[name] = global.legacyQiankun[name] || {}
    Object.assign(global.legacyQiankun[name], {
      proxy,
      publicPath,
      '__INJECTED_PUBLIC_PATH_BY_QIANKUN__': proxy && proxy.__INJECTED_PUBLIC_PATH_BY_QIANKUN__,
      '__POWERED_BY_QIANKUN__': proxy && proxy.__INJECTED_PUBLIC_PATH_BY_QIANKUN__,
    })`

  const postInjectStr = `
    const app = global.legacyQiankun[name]
    if (!app.proxy) return
    window[name] = {
      bootstrap: (...args) => app.dynamicImport.then(() => app.lifecyle.bootstrap(...args)),
      mount: (...args) => app.dynamicImport.then(() => app.lifecyle.mount(...args)),
      unmount: (...args) => app.dynamicImport.then(() => app.lifecyle.unmount(...args)),
      update: (...args) => app.dynamicImport.then(() => app.lifecyle.update(...args)),
    }`

  const legacyCode = `
  const legacyQiankunWindow = new Proxy({}, {
    get(target, p, receiver) {
      const fakeWindow = window?.legacyQiankun?.['${name}']?.proxy
      if (fakeWindow) return fakeWindow[p]
      return window[p]
    },
    set(target, p, newValue, receiver) {
      const fakeWindow = window?.legacyQiankun?.['${name}']?.proxy
      if (fakeWindow) return fakeWindow[p] = newValue
      return window[p] = newValue
    },
  });

  const legacyQiankunDocument = new Proxy({}, {
    get(target, p, receiver) {
      const fakeDocument = window?.legacyQiankun?.['${name}']?.proxy?.document
      if (fakeDocument) return fakeDocument[p]
      return typeof document[p] === 'function' ? document[p].bind(document) : document[p]
    },
    set(target, p, newValue, receiver) {
      const fakeDocument = window?.legacyQiankun?.['${name}']?.proxy?.document
      if (fakeDocument) return fakeDocument[p] = newValue
      return document[p] = newValue
    },
  });\n`

  const varMap = {
    'document': 'legacyQiankunDocument',
    'window': 'legacyQiankunWindow',
    'globalThis': 'legacyQiankunWindow',
    'self': 'legacyQiankunWindow',
  }

  const include = [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/, /\.svelte$/]
  // const exclude = [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/]
  const devTransform = (code: string, id?: string) => {
    if(
      id.includes('vite-plugin-legacy-qiankun/dist') ||
      !include.some(reg => reg.test(id))
    ) return code

    if (
      !/(document|window|globalThis|self)/g.test(code)
    ) return code

    
    if (id && id.includes('client')) {
      code = code.replace('(!style)', '(style?.remove() || true)')
    }

    if (devSandbox) {
      Object.keys(varMap).forEach(k => {
        code = convertVariable(code, k, varMap[k])
      })
    }
    
    return `${legacyCode}${code}`
  }

  const devTransformIndexHtml = (html: string) => {
    const srcReg = createAttrReg('src')
    return html
      .replace(scriptModuleReg, (script, ...args) => {
        const srcMatch = script.match(srcReg)
        const src = srcMatch?.[2] || ''

        if (!src && args[3]) {
          const importReg = /import(.+)from(\s*)('|")([^'"]+)\3/g
          const nameList: string[] = []
          const urlList: string[] = []
          let res: RegExpExecArray | null
          // eslint-disable-next-line no-cond-assign
          while (res = importReg.exec(args[3] as string)) {
            nameList.push(res[1].trim())
            let url = res[4].trim()
            if (url.startsWith('/')) url = url.slice(1)
            urlList.push(`import((window?.proxy?.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/') + '${url}')`)
          }

          return `<script>
          (function(){
            window.addEventListener('load', () => {
              Promise.all([${urlList.join(',')}]).then(([${nameList.join(',')}]) => {
                ${nameList.map(name => `${name} = ${name}.default || ${name}`).join('\n')}
                ${args[3].replace(importReg, '')}
              })
            })
            })()
          </script>`
        }

        if (!src.includes('@vite')) return `${createScriptStr(`global.legacyQiankun[name].dynamicImport = import(global.legacyQiankun[name].publicPath + '${src}')`)}`

        return `${createScriptStr(`import(global.legacyQiankun[name].publicPath + '${src}')`)}`
      })
      .replace('<head>', match => `${match}\n${createScriptStr(preInjectStr)}`)
      .replace('</body>', match => `${createScriptStr(postInjectStr)}\n${match}`)
  }

  const proTransformIndexHtml = (html: string) => {
    const idReg = createAttrReg('id')
    const srcReg = createAttrReg('data-src')
    return html
      .replace(scriptModuleReg, replaceScript)
      .replace(scriptNoModuleReg, script => {
        const idMatcher = script.match(idReg)
        const id = idMatcher?.[2]
        if (!id || id === 'vite-legacy-polyfill') return script.replace('nomodule', '')

        if (id === 'vite-legacy-entry') {
          const srcMatch = script.match(srcReg)
          let src = `'${srcMatch?.[2] || ""}'`

          if (!hasProtocol(src)) src = `!global.legacyQiankun[name].__POWERED_BY_QIANKUN__ ? ${src} : new URL(${src}, global.legacyQiankun[name].__POWERED_BY_QIANKUN__).toString()`
          
          return `${createScriptStr(`global.legacyQiankun[name].dynamicImport = System.import(${src})`)}`
        }

        return replaceScript(script)
      })
      .replace('<head>', match => `${match}\n${createScriptStr(preInjectStr)}`)
      .replace('</body>', match => `${createScriptStr(postInjectStr)}${match}`)
  }

  return {
    devTransform,
    devTransformIndexHtml,
    proTransformIndexHtml
  }
}

export const legacyQiankun = (options: PluginOptions): Plugin[] => {
  const {
    devTransform,
    devTransformIndexHtml,
    proTransformIndexHtml
  } = createCtx(options)

  return [
    {
      name: 'legacy-qiankun:dev',
      enforce: 'post',
      apply: 'serve',
      transformIndexHtml: devTransformIndexHtml,
      transform: devTransform,
    },
    {
      name: 'legacy-qiankun:build',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml: proTransformIndexHtml
    }
  ]
}
