<template>
  <div class="container">
    <h1>vue3 + vite</h1>
    <h3>
        设置全局变量：microName：
        <input type="text" v-model='microName' placeholder='设置全局变量：microName' @input='setMicroName' />
        <button @click='output'>打印全局变量：microName</button>
    </h3>

    <div style="margin-bottom: 20px">
      <router-link to="/">Go to Home</router-link>
      <router-link style="margin-left: 20px" to="/about">Go to About</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
window.microName = 'vite_vue3'
export default {
  data() {
    return {
      microName: 'vite_vue3'
    }
  },
  methods: {
    setMicroName() {
      window.microName = this.microName
    },
    output() {
      console.log('全局变量：microName', window.microName)
    }
  }
}
</script>

<style>

.container {
  color: red;
  border: 1px solid;
}

































</style>