
import zrender from 'zrender'
class BackgroundLayer{
    constructor(zr){
        if(!zr){
            throw '未传入实例化的zrender'
        }
        this.zr = zr       
        this.hasGridLine = false
        this.gridColor = '#eeeeee'
        this.color='#ffffff'
        this.stepX = 20
        this.stepY = 20
        this.backRect = null
        // 背景色
        this.drawBackground(this.color)
        // 网格线
        this.groupLines = null
    }
    drawBackground(bgColor){
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
            style: {
                stroke:'#ffc8aa',
                fill: bgColor
            },
            position: [0,0],
            zlevel:-2,
            silent:true
        })
        zr.add(this.backRect);
    }
    drawGrid(lineColor, stepx, stepy) {
        if(this.groupLines){
            this.zr.remove(this.groupLines)
        }
        const g = new zrender.Group() 
        g.positon = [0,0]
        g.silent = true
        this.groupLines = g
        this.zr.add(g)
        const { width, height } = this.backRect.getBoundingRect()
        for (var i = stepx; i < width; i += stepx) {            
            this.groupLines.add(new zrender.Line({
                shape: {
                    x1: i,
                    y1: 0,
                    x2: i,
                    y2: height
                },
                style: {
                    stroke: lineColor
                },
                zlevel:-1,
                silent:true,
            }))
        }
        for (var j = stepy; j < height; j += stepy) {
            this.groupLines.add(new zrender.Line({
                shape: {
                    x1: 0,
                    y1: j,
                    x2: width,
                    y2: j
                },
                style: {
                    stroke: lineColor
                },
                zlevel:0,
                silent:true,
            }))
        }
        this.hasGridLine = true
        this.stepX = stepx
        this.stepY = stepy
        this.gridColor = lineColor
    }
    clearGrid(){
        this.zr.remove(this.groupLines)
        this.hasGridLine = false
    }
    resize(){
        this.drawBackground(this.color)
        if(this.hasGridLine){
            this.drawGrid(this.gridColor,this.stepX,this.stepY)
        }
    }
}
export default BackgroundLayer