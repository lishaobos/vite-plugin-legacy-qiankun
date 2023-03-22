// index.ts
var scriptModuleReg = /<script(\s+)type=('|")module\2(.*)>([^<]*)<\/script>/g;
var scriptNoModuleReg = /<script(\s+)nomodule(.*)>([^<]*)<\/script>/g;
var createAttrReg = (attr) => new RegExp(attr + `=('|")([^>\\s]+)\\1`);
var replaceScript = (script) => `<!-- replace by vite-plugin-legacy-qiankun ${script} -->`;
var getMicroApp = (appName) => {
  const global = (0, eval)("window");
  return global.legacyQiankun && global.legacyQiankun[appName] || {};
};
var createLifecyle = (name, lifecyle) => {
  const global = (0, eval)("window");
  global.legacyQiankun = global.legacyQiankun || {};
  global.legacyQiankun[name] = global.legacyQiankun[name] || {};
  global.legacyQiankun[name].lifecyle = lifecyle;
};
var legacyQiankun = ({ name }) => {
  const createScriptStr = (scriptContent) => `<script>
(function (){
const global = (0, eval)('window')
const name = '${name}'
${scriptContent}})()
<\/script>`;
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
    })`;
  const postInjectStr = `
    const app = global.legacyQiankun[name]
    if (!app.proxy) return
    window[name] = {
      bootstrap: (...args) => app.dynamicImport.then(() => app.lifecyle.bootstrap(...args)),
      mount: (...args) => app.dynamicImport.then(() => app.lifecyle.mount(...args)),
      unmount: (...args) => app.dynamicImport.then(() => app.lifecyle.unmount(...args)),
    }`;
  const devTransform = (code, id) => {
    const preCode = `const legacyQiankunWindow = new Proxy({}, {
      get(target, p, receiver) {
        const fakeWindow = window?.legacyQiankun?.${name}?.proxy
        if (fakeWindow) return fakeWindow[p]
        return window[p]
      },
      set(target, p, newValue, receiver) {
        const fakeWindow = window?.legacyQiankun?.${name}?.proxy
        if (fakeWindow) return fakeWindow[p] = newValue
        return window[p] = newValue
      },
    })`;
    code = `${preCode};
${code}`;
    if (id.includes("client")) {
      code = code.replace("(!style)", "(style?.remove() || true)").replace(new RegExp("(?<!\\.)document\\.", "g"), `legacyQiankunWindow.document.`);
    }
    return code;
  };
  const devTransformIndexHtml = (html) => {
    const srcReg = createAttrReg("src");
    return html.replace(scriptModuleReg, (script, ...args) => {
      const srcMatch = script.match(srcReg);
      const src = (srcMatch == null ? void 0 : srcMatch[2]) || "";
      if (!src && args[3]) {
        const importReg = /import(.+)from(\s*)('|")([^'"]+)\3/g;
        const nameList = [];
        const urlList = [];
        let res;
        while (res = importReg.exec(args[3])) {
          nameList.push(res[1].trim());
          let url = res[4].trim();
          if (url.startsWith("/"))
            url = url.slice(1);
          urlList.push(`import((window?.proxy?.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/') + '${url}')`);
        }
        return `<script>
          (function(){
            window.addEventListener('load', () => {
              Promise.all([${urlList.join(",")}]).then(([${nameList.join(",")}]) => {
                ${nameList.map((name2) => `${name2} = ${name2}.default || ${name2}`).join("\n")}
                ${args[3].replace(importReg, "")}
              })
            })
            })()
          <\/script>`;
      }
      if (!src.includes("@vite"))
        return `${createScriptStr(`global.legacyQiankun[name].dynamicImport = import(global.legacyQiankun[name].publicPath + '${src}')`)}`;
      return `${createScriptStr(`import(global.legacyQiankun[name].publicPath + '${src}')`)}`;
    }).replace("<head>", (match) => `${match}
${createScriptStr(preInjectStr)}`).replace("</body>", (match) => `${createScriptStr(postInjectStr)}
${match}`);
  };
  const proTransformIndexHtml = (html) => {
    const idReg = createAttrReg("id");
    const srcReg = createAttrReg("data-src");
    return html.replace(scriptModuleReg, replaceScript).replace(scriptNoModuleReg, (script) => {
      const idMatcher = script.match(idReg);
      const id = idMatcher == null ? void 0 : idMatcher[2];
      if (!id || id === "vite-legacy-polyfill")
        return script.replace("nomodule", "");
      if (id === "vite-legacy-entry") {
        const srcMatch = script.match(srcReg);
        let src = (srcMatch == null ? void 0 : srcMatch[2]) || "";
        const isHttpReg = /^(https?):\/\//;
        if (isHttpReg.test(src)) {
          return `${createScriptStr(`global.legacyQiankun[name].dynamicImport = System.import('${src}')`)}`;
        }
        if (src.startsWith(".")) {
          src = src.substring(1);
        }
        return `${createScriptStr(`global.legacyQiankun[name].dynamicImport = System.import(global.legacyQiankun[name].publicPath + '${src}')`)}`;
      }
      return replaceScript(script);
    }).replace("<head>", (match) => `${match}
${createScriptStr(preInjectStr)}`).replace("</body>", (match) => `${createScriptStr(postInjectStr)}${match}`);
  };
  return [
    {
      name: "legacy-qiankun:dev",
      enforce: "post",
      apply: "serve",
      transformIndexHtml: devTransformIndexHtml,
      transform: devTransform
    },
    {
      name: "legacy-qiankun:build",
      enforce: "post",
      apply: "build",
      transformIndexHtml: proTransformIndexHtml
    }
  ];
};
export {
  createLifecyle,
  getMicroApp,
  legacyQiankun
};
