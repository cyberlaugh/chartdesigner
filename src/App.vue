<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:00:05
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-16 15:40:14
-->
<template>
  <div id="app">
    <designer v-if="showDesign" />
    <custom-page v-else />
    <el-button @click="showDesign = !showDesign">切换设计-运行页面</el-button>
    <el-button @click="showRuntimeComps">控制台打印运行时页面组件</el-button>
  </div>
</template>

<script>
import Designer from './views/designer'
import CustomPage from './views/customPage'
export default {
  name: 'App',
  components: {
    Designer,
    CustomPage
  },
  data(){
    return {
      showDesign:false
    }
  },
  methods: {
    showRuntimeComps(){
      console.log('控制台打印运行时页面组件', this.$cvr.getAllComps())
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
html,body{
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
