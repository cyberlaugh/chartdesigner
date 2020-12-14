<!--
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:19:30
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-12-14 15:27:02
-->
<template>
    <div>
        <Header />
        <div class="wrapper-designer">
            <toolbar />
            <board :cfg="pageCfg"/>
            <property :cfg="canvasStyle"/>
        </div>
    </div>  
</template>

<script>
import Header from '../Header'
import Toolbar from '../toolbar'
import Board from '../board'
import Property from '../property/index'
import { cloneDeep } from 'lodash'
import { getPageCfg, savePageCfg } from '../api'
export default {
    name:'Designer',
    components:{
        Header,
        Toolbar,
        Board,
        Property
    },
    props:{
        pageInfo:{
            type: Object,
            required: true
        }
    },
    data(){
        return {
            pageCfg:null,
            canvasStyle:null
        }
    },
    watch:{
        '$props.pageInfo':{
            handler(newer){                
                this.getPageCfg(newer)
            },
            deep:true
        }
    },
    methods:{
        getPageCfg(pageInfo){
            let pageCfg = null
            if(pageInfo.id){
                pageCfg = getPageCfg(pageInfo.id)
            }
            this.$store.dispatch('designer/initPage',pageCfg)
            this.pageCfg = cloneDeep(pageCfg)
            console.log('页面配置', this.pageCfg)
            this.canvasStyle = {...pageCfg.style}
        },
        savePageCfg(){
            savePageCfg(this.$store.getters['designer/getPageCfg']())
        },
    },
    created(){
        this.getPageCfg(this.pageInfo)
        this.$cvd.on('saveDesign',this.savePageCfg)
    },
    beforeDestroy(){
        this.$cvd.off()
    }
}
</script>

<style lang="scss" scoped>
.wrapper-designer {
    display: flex;
    width:100%;
    box-sizing: border-box;
    height: calc(100vh - 90px);
    min-height: 400px;
}
</style>