<template>
  <div class="design-header">
        <!-- <span @click.stop="openFile" class="iconfont icon-open" style="float:left;margin-left:10px;font-size:18px"></span> -->
        <span class="page-title">[{{pageInfo.id}}] {{ pageInfo.title }}</span>
        <ul>
            <li @click="command(item)" v-for="(item ,index) in icon" v-bind:key="index" :title="item.cmd" v-bind:class="'iconfont '+item.icon+' '+item.class"></li>
            <li>
                <span class="iconfont icon-upload-demo" @click.stop="showUpload"></span>
                <ul v-show="upload">
                  <li class="iconfont icon-JSON" @click.stop="save('json')"><span>JSON</span></li>
                  <li class="iconfont icon-PNG" @click.stop="save('png')"><span>PNG</span></li>
                  <!-- <li class="iconfont icon-jpg" @click.stop="save('jpg')"><span>JPG</span></li> -->
                </ul>
            </li>
        </ul>
        <input type="file" id="file" style="display:none"/>
  </div>
</template>

<script>
export default {
  name: 'DesignHeader',
  data(){
     return{
        language:'zh',
        showLang:false,
        icon:[
               {
                icon:'icon-undo',
                name:'撤销',
                cmd:'undo',
                class:'disable'
              },
              {
               icon:'icon-redo',
               name:'恢复',
               cmd:'redo',
               class:'disable'
             },
             {
               icon:'icon-fengexian',
               name:'分割',
               cmd:'line',
               class:'disable'
             },
              {
                icon:'icon-copy',
               name:'复制',
               cmd:'copy',
               class:'disable'
            },
            {
              icon:'icon-shanchu',
              name:'删除',
              cmd:'delete',
              class:'disable'
            },
            // {
            //    icon:'icon-fengexian',
            //    name:'分割',
            //    cmd:'line',
            //    class:'disable'
            //  },
            //  {
            //    icon:'icon-to-front',
            //    name:'最上层',
            //    cmd:'tofront',
            //    class:'disable'
            //  },
            //  {
            //    icon:'icon-to-back',
            //    name:'最下层',
            //    cmd:'toback',
            //    class:'disable'
            //  },
             {
               icon:'icon-fengexian',
               name:'分割',
               cmd:'line',
               class:'disable'
             },
              {
               icon:'icon-kuangxuan',
               name:'框选',
               cmd:'selectFrame',
               class:'disable'
             },
             {
               icon:'icon-group',
               name:'成组',
               cmd:'createGroup',
               class:'disable'
             },
              {
               icon:'icon-ungroup',
               name:'取消成组',
               cmd:'ungroup',
               class:'disable'
             }
        ],
        disable:true,
        upload:false
        
     }
  },
  computed:{
    pageInfo(){
      const pageCfg = this.$store.getters['designer/getPageCfg']()
      if(pageCfg){        
        return { title:pageCfg.title, id:pageCfg.id }
      }else{
        return { title:'undefined', id:'-1' }
      }
    }
  },
  mounted(){
    this.$cvd.on('selectNode',()=>{
      this.status="selectNode";
      this.changeDisable(true);
    });

    this.$cvd.on('selectNodes',()=>{
      this.status="selectNodes";
      this.changeDisable(true);
    });

    this.$cvd.on('clearSelect',()=>{
      this.status="clearSelect";
      this.changeDisable(false);
    });

    this.$cvd.on('selectGroup',()=>{
      this.status="selectGroup";
      this.changeDisable(true);
    });

    this.$cvd.on('undoredo',(e)=>{
       this.enableUndo(e.undo);
       this.enableRedo(e.redo);
    });

    this.$cvd.on('selectEdge',()=>{
       this.status="selectEdge";
       this.changeDisable(true);
    });

    var fileDom=document.getElementById('file');
   // fileDom.removeEventListener('change');
    fileDom.addEventListener('change',(e)=>{
         var file=e.target.files[0];
        if(file&&file.name.endsWith('json')){
          var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
          reader.readAsText(file);//读取文件的内容
          reader.onload = function(){
            try{
              this.$cvd.on.$emit('initFlow',{data:JSON.parse(this.result)});
            }catch(e){
              alert('数据出错')
            }
          }
        }
        fileDom.value='';
    },false);
  },
  methods:{
    openFile(){
       document.getElementById('file').click();
    },
    mouseenter(){
         this.showLang = true;
    },
    mouseleave(){
         this.showLang = false;
    },
    command(item){
      if(item.class!='disable'){
        this.$cvd.emit(item.cmd);
      }
    },
    changeDisable(flag){
      if(flag){
        this.icon.forEach(item=>{
            if(['undo','redo'].indexOf(item.cmd)==-1){
                item.class='';
            }
        });
      }else{
        this.icon.forEach(item=>{
              if(['undo','redo'].indexOf(item.cmd)==-1){
                item.class='disable';
            }
         });
      }
      this.disable=flag;
    },
    enableUndo(flag){
      if(flag){
        this.icon[0].class='';
      }else{
        this.icon[0].class='disable';
      }
    },
    enableRedo(flag){
      if(flag){
        this.icon[1].class='';
      }else{
        this.icon[1].class='disable';
      }
    },
    showUpload(){
         this.upload=!this.upload;
    },
    save(type){
       this.upload=false;
       this.$cvd.emit('saveDesign',{type});
    }
  }
}
</script>

<style lang="scss" scoped>
.design-header{
   -webkit-user-select: none;
   user-select: none;
   line-height: 40px;
   height: 40px;
   border:1px solid #e6e9ed;
   box-sizing: border-box;
   -webkit-box-sizing: border-box;
   text-align: center;
   display:flex;
   .page-title{
      margin-left: 10px;
      font-size:14px;
      max-width: 600px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
   }
   ul {
    list-style-type: none;
    padding: 0;
    margin-top:0;
    margin-bottom: 0;
    flex:1;
    margin-left: 20px;
    li {
      display: inline-block;
      margin: 0 10px;
      cursor: pointer;
      &.disable{
        color:#ccc;
      }
      ul{
        position: absolute;
        border:1px solid #f5f5f5;
        cursor: pointer;
        z-index: 200;
        li{
          display: block;
          text-align: left;
          font-size: 16px;
          line-height: 30px;
          background: #fff;
          padding:0 10px;
          margin:0;
          &:hover{
            background: #f5f5f5;
          }
          span{
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
