<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:19:30
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-21 17:40:49
-->
<template>
  <div class="wrapper-designer">
      <toolbar />
      <board />
      <property />
  </div>
</template>

<script>
import Toolbar from '@/customview/designtime/toolbar'
import Board from '@/customview/designtime/board'
import Property from '@/customview/designtime/property/index'
export default {
    name:'Designer',
    components:{
        Toolbar,
        Board,
        Property
    },
    beforeDestroy(){
        this.$cvd.off()
    }
}
</script>

<style lang="scss" scoped>
.wrapper-designer {
    display: flex;
    box-sizing: border-box;
    height: calc(100vh - 60px);
    min-height: 400px;
}
</style>