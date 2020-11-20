
<template>
  <div class="designer-board">
        <div class="board-top-bar">
            画布: 宽<el-input-number v-model="canvas.width" :controls="false" size="mini" :min="100"/>px
             高<el-input-number v-model="canvas.height" :controls="false" size="mini" :min="100" />px
            <el-checkbox style="margin-left:20px;" size="small" v-model="isGridShow" @change="toggleShowGrid">网格线</el-checkbox>
        </div>
        <div id="designer-board-editor" @dragover="dragover" @dragstart="dragstart" @drop="drop">
            <canvas id="canvas-background"></canvas>
        </div>
  </div>
</template>

<script>
import Editor from './editor'
export default {
    data(){
        return{
            isGridShow:false,
            canvas:{
                width:800,
                height:800,
            },
            editor:null
        }
    },
    watch:{
        canvas:{
            handler(newer){
                this.setEditorSize(newer.width,newer.height)
            },
            deep:true
        }
    },
    methods:{
        setEditorSize(width, height){
            this.editor.resize(width, height)
        },
        toggleShowGrid(){
            if(this.isGridShow){                
                this.editor.background.drawGrid('#ccc', 20, 20)
            }else{
                this.editor.background.clearGrid()
            }
        },
        dragstart(e){
            e.preventDefault()
        },
        dragover(e){
            e.preventDefault()
        },
        drop(e){
            var text= e.dataTransfer.getData("addShape");
            var x=parseInt(e.offsetX)+0.5;
            var y=parseInt(e.offsetY)+0.5;
            try{
                var data=JSON.parse(text);
                data['x']=x;
                data['y']=y;
                this.editor.addShape(data);
            }catch(err){
            //window.console.log(err);
            }
        },
    },
    mounted(){
        this.editor = new Editor('#designer-board-editor')
        const editorSize = this.editor.getSize()
        this.canvas.width = editorSize.width
        this.canvas.height = editorSize.height
    }
}
</script>

<style lang="scss"  scoped>
.designer-board{
  flex:1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .board-top-bar{
      height: 30px;
      padding: 10px;
      border: 1px solid #cccccc;
      font-size: 12px;
      .el-input-number.el-input-number--mini.is-without-controls {
          width: 40px;
          height: 22px;
          line-height: 22px;
          margin: 0 4px;
        /deep/.el-input__inner {
            padding-left: 2px;
            padding-right: 2px;
            height: 22px;
           line-height: 22px;
        }
      }
  }
  #designer-board-editor{
      background: #f4f4f4;
      text-align: left;
      box-sizing: border-box;
      flex:1;
      overflow: auto;
    //   height: 800px;
    //   margin:0 auto;
    //   position: relative;
    //   top:50%;
    //   transform: translateY(-50%);
    // display: flex;
    // align-items: center;
    // justify-content: center;
    // border: 1px solid #cccccc;
  }
}
</style>