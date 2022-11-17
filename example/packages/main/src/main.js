import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { start } from './micro'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

start({
  sandbox: {
    experimentalStyleIsolation: true
  }
})
