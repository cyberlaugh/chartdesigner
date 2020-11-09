<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:19:30
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-09 10:36:28
-->
<template>
  <div class="wrapper-designer">
      <toolbar />
      <board />
  </div>
</template>

<script>
import Toolbar from '@/components/toolbar'
import Board from '@/components/board'
export default {
    name:'Designer',
    components:{
        Toolbar,
        Board
    }
}
</script>

<style lang="scss" scoped>
.wrapper-designer {
    display: flex;
    height: calc(100vh - 60px);
    min-height: 400px;
}
</style>