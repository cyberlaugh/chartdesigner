
import zrender from 'zrender'
class BackgroundLayer{
    constructor(editor){
        this.zr = editor.zr
        this.$cvd = editor.$cvd
        this.isShowGridLine = false
        
        this.backStyle={
            style:{
                fill:'#ffffff'
            }
        }
        this.gridStyle = {
            style: {
                stroke: '#b3b3b3',
                lineWidth:.5
            }
        }
        this.stepX = 20
        this.stepY = 20
        this.backRect = null
        // 背景色
        this.drawBackground()
        // 网格线
        this.groupLines = null
        this.initEventListeners()        
    }
    initEventListeners(){
        this.$cvd.on('updateBackgroundStyle',this.updateBackgroundStyle, this)
        this.$cvd.on('updateGridColor',this.updateGridColor, this)
        this.$cvd.on('toggleShowGrid',this.toggleGridShow, this) 
    }
    removeEventListeners(){        
        this.$cvd.off('updateBackgroundFill',this.updateBackgroundStyle)
        this.$cvd.off('updateGridColor',this.updateGridColor)
        this.$cvd.off('togtoggleGridShowgle', this.toggleGridShow)
    }
    drawBackground(){
        const zr = this.zr
        if(this.backRect){
         zr.remove(this.backRect)
        }
        // 背景色
        this.backRect = new zrender.Rect({
            shape: {
                x: 0,
                y: 0,
                width: zr.getWidth(),
                height:zr.getHeight()
            },
            ...this.backStyle,
            position: [0,0],
            zlevel:-2,
            silent:true
        })
        zr.add(this.backRect);
    }
    updateBackgroundStyle(cfg){
        zrender.util.merge(this.backStyle,cfg,true)        
        this.backRect.attr(this.backStyle)
    }
    updateGridColor(color){
        zrender.util.merge(this.gridStyle,{style:{stroke:color}},true)
        if(this.groupLines){
            this.groupLines.eachChild(c=>{
                c.attr(this.gridStyle)
            })
        }
    }
    drawGrid() {
        const {stepX, stepY} = this
        if(this.groupLines){
            this.zr.remove(this.groupLines)
            this.groupLines = null
        }
        const g = new zrender.Group() 
        g.positon = [0,0]
        g.silent = true
        this.groupLines = g        
        const { width, height } = this.backRect.getBoundingRect()
        for (var i = stepX; i < width; i += stepX) {            
            this.groupLines.add(new zrender.Line({
                shape: {
                    x1: i,
                    y1: 0,
                    x2: i,
                    y2: height
                },
                ...this.gridStyle,
                zlevel:-1,
                silent:true,
            }))
        }
        for (var j = stepY; j < height; j += stepY) {
            this.groupLines.add(new zrender.Line({
                shape: {
                    x1: 0,
                    y1: j,
                    x2: width,
                    y2: j
                },
                ...this.gridStyle,
                zlevel:-1,
                silent:true,
            }))
        }
        this.zr.add(g)
        this.isShowGridLine = true
    }
    toggleGridShow(isShowGrid){
        this.isShowGridLine = isShowGrid
        if(!this.groupLines && isShowGrid){
            this.drawGrid()
            return
        }
        if(isShowGrid){
            this.groupLines.eachChild(c=>{
                c.show()
            })            
        }else{
           this.groupLines && this.groupLines.eachChild(c=>{
                c.hide()
            })
        }
    }
    clearGrid(){
        this.zr.remove(this.groupLines)
        this.groupLines = null
        this.isShowGridLine = false
    }
    resize(){
        this.drawBackground()
        if(this.isShowGridLine){
            this.drawGrid()
        }else if(this.groupLines){
            this.clearGrid()
        }
    }
    destroy(){
        if(this.zr){
            this.zr.remove(this.backRect)
            this.zr.remove(this.groupLines)
            this.backRect = null
            this.groupLines = null
        }
        this.removeEventListeners()
    }
}
export default BackgroundLayer