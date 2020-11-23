<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-13 14:55:47
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-19 12:02:08
-->
<template>
  <el-input class="cv-widget cv-input" :id="`cv-input_${id}`" v-model="value" :placeholder="placeholder" :style="style" @change="changeV" />
</template>

<script>
import mixin from './mixin'
export default {
    name:'CvInput',
    mixins:[mixin],
    data(){
        return{
            value:'',
            placeholder:''
        }
    },
    created(){
        this.value = this.cfg.value
        this.placeholder = this.cfg.placeholder
    }
}
</script>

<style>

</style> 