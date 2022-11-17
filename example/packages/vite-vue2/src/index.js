import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { createLifecyle, getMicroApp } from 'vite-plugin-legacy-qiankun'
import pkg from '../package.json'
import Home from './Home.vue'

const microApp = getMicroApp(pkg.name)

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: microApp.__POWERED_BY_QIANKUN__ ? pkg.name : '/',
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: () => import('./About.vue') },
  ]
})

const render = () => {
  new Vue({
    router,
    render: (h) => h(App)
  }).$mount('#app')
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