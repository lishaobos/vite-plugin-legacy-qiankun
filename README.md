# vite-plugin-legacy-qiankun

让 qiankun 集成 vite

## example

- [code](./example/README.md)
- [在线体验地址](http://120.46.195.54/)

## 安装

```js
npm i vite-plugin-legacy-qiankun @vitejs/plugin-legacy -D
```

## 版本需要

vite >= 3

## 特性

- 保留 native module
- 生产环境 js 沙箱
- 生产环境 css 沙箱
- 开发环境 css 沙箱
- 开发环境 js 沙箱（开发中。。。）

## 使用

### vue3 + vite

```js
// main.js
import { createLifecyle, getMicroApp } from 'vite-plugin-legacy-qiankun'
import { createRouter, createWebHistory } from 'vue-router'
import pkg from '../package.json' // your micro app name (pkg.name)

const microApp = getMicroApp(pkg.name)

const router = createRouter({
  history: createWebHistory(microApp.__POWERED_BY_QIANKUN__ ? pkg.name : '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./about.vue')
    }
  ]
})

const render = () => {
  createApp(App)
    .use(router)
    .mount(`#app_p3`)
}

if (microApp.__POWERED_BY_QIANKUN__) {
  createLifecyle(pkg.name, {
    mount(props) {
      console.log('mount', pkg.name);
      render();
    },
    bootstrap() {
      console.log('bootstrap', pkg.name);
    },
    unmount() {
      console.log('unmount', pkg.name)
    }
  })
} else {
  render();
}
```

### vue2 + vite

```js
// main.js
import { createLifecyle, getMicroApp } from 'vite-plugin-legacy-qiankun'
import VueRouter from 'vue-router'
import pkg from '../package.json' // your micro app name (pkg.name)

const microApp = getMicroApp(pkg.name)

const router = new VueRouter({
  mode: 'history',
  base: microApp.__POWERED_BY_QIANKUN__ ? pkg.name : '/',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./about.vue')
    }
  ]
})

const render = () => {
  new Vue({
    router,
    render: (h) => h(App)
  }).$mount('#app_p3')
}

if (microApp.__POWERED_BY_QIANKUN__) {
  createLifecyle(pkg.name, {
    mount(props) {
      console.log('mount', pkg.name);
      render();
    },
    bootstrap() {
      console.log('bootstrap', pkg.name);
    },
    unmount() {
      console.log('unmount', pkg.name)
    }
  })
} else {
  render();
}
```

### react + vite

```js
// main.jsx
import { createLifecyle, getMicroApp } from 'vite-plugin-legacy-qiankun'

const render = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

const microApp = getMicroApp(pkg.name)

if (microApp.__POWERED_BY_QIANKUN__) {
  createLifecyle(pkg.name, {
    mount(props) {
      console.log('mount', pkg.name);
      render();
    },
    bootstrap() {
      console.log('bootstrap', pkg.name);
    },
    unmount() {
      console.log('unmount', pkg.name)
    }
  })
} else {
  render();
}
```

## vite.config

### react
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'

export default defineConfig({
  plugins: [
    react({ fastRefresh: false }),
    legacy(),
    legacyQiankun({ name: 'your micro app name' })
  ]
})
```

### vue2
```js
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'

export default defineConfig({
  plugins: [
    createVuePlugin(),
    legacy(),
    legacyQiankun({ name: 'your micro app name' })
  ]
})
```

### vue3
```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy' // need this
import { legacyQiankun } from 'vite-plugin-legacy-qiankun'

export default defineConfig({
  plugins: [
    vue(),
    legacy(),
    legacyQiankun({ name: 'your micro app name' })
  ]
})
```