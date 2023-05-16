<template>
  <div id="container">
    <h1>我是主应用</h1>
    <h2>所有应用都使用了 .container 这个 class，可以查看样式隔离</h2>
    <h2>
      <div>js 沙箱仅生产环境生效</div>
      <button @click="output">打印全局变量：microName</button>
    </h2>
    <router-link to='/vite_react'>去 vite-react</router-link>
    <router-link to='/vite_vue2'>去 vite-vue2</router-link>
    <router-link to='/vite_vue3'>去 vite-vue3</router-link>
    <div id="micro"></div>
  </div>
</template>



<script>
export default {
  methods: {
    output () {
      console.log('全局变量：microName', window.microName)
    }
  }
}

</script>

<style>
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#container > a {
    margin-right: 20px;
}

.container {
  color: blue;
}
</style>
