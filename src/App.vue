<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:00:05
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-12-02 10:00:17
-->
<template>
  <div id="app">
    <list-design-pages v-show="!showDesign && !showRuntime" @edit="editPage" @preview="preview"></list-design-pages>
    <designer v-if="showDesign" :pageInfo="pageInfo"/>
    <custom-page v-if="showRuntime" :idPage="pageInfo.id"/>
    <div>
      <el-button @click="backToList">返回设计列表</el-button>
      <el-button @click="getOutPutDesigner">设计输出JSON</el-button>
      <el-button @click="showRuntimeComps">控制台打印运行时页面组件</el-button>
    </div>
   
  </div>
</template>

<script>
import Designer from './customview/designtime/views/designer'
import CustomPage from './customview/runtime/views/customPage'
import ListDesignPages from './customview/designtime/views/designList'
export default {
  name: 'App',
  components: {
    Designer,
    CustomPage,
    ListDesignPages
  },
  data(){
    return {
      showDesign:false,
      showRuntime:false,
      pageInfo:{
        id:'',
        title:'',
        creator:'luanf'
      }
    }
  },
  methods: {
    showRuntimeComps(){
      console.log('控制台打印运行时页面组件', this.$cvr.getAllComps())
    },
    openDesign(){
      this.showDesign = !this.showDesign
    },
    backToList(){
      this.showDesign = false
      this.showRuntime = false
    },
    getOutPutDesigner(){
      console.log('getOutPutDesigner',this.$store.getters['designer/getClonedElementCfg'](this.pageInfo.id))
    },
    editPage(pageInfo){
      this.pageInfo = pageInfo
      this.showDesign = true
    },
    preview(pageInfo){
      this.pageInfo = pageInfo
      this.showRuntime = true
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
