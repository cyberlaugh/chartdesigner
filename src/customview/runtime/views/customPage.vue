<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-13 11:20:40
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-16 10:04:36
-->
<template>
    <custom-view :schema="schema" />
</template>

<script>
import CustomView from '@/customview/runtime/index'
import { getPageSchema } from '@/customview/runtime/api/schemaLoader'

export default {
    components:{
        CustomView
    },
    data(){
        return {
            schema:null
        }
    },
    methods:{
        loadPageInfo(){
            this.schema = getPageSchema()
        }
    },
    beforeMount(){
        this.loadPageInfo()
    }
}
</script>

<style>

</style>