/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-09 17:58:09
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-30 12:21:06
 * @Tool: Auto Generated by koroFileHeader
 */

import zrender from 'zrender'
import BackgroundLayer from './BackgroundLayer'
import * as cmd from './command'
import Stack from './stack'
import shape from './shape'
import DeDomWidget from './dom'
import Frame from './frame'
import DomFrame from './dom/domFrame'
import cvBusDesignTime from './bus'

class DesignEditor extends zrender.Group {
    constructor(domSelector, data){
        super()
        this.$cvd = cvBusDesignTime
        const container = document.querySelector(domSelector)
        const width = container.offsetWidth - 4 
        const height = container.offsetHeight - 4
        this.zr = zrender.init(container,{
            renderer:'canvas',
            devicePixelRatio: 2,
            width: width<800 ? 800 : width,
            height: height<800 ? 800 : height
        });
       
        this.id=this.uuid();
        this.data = data || {};
        this.stack = new Stack(this.data.stackStep || 50)

        this.nodes = []
        this.edges = []
        this.groups = []

        this.status = ''

        this.background = new BackgroundLayer(this)
        this.frame = new Frame(this);
        this.frame.addTo(this);
        this.domFrame = new DomFrame(this)
        this.domFrame.addTo(this)

        //框选
        this.selectFrame = new zrender.Rect({
            style: {
                fill: '#1890ff',
                opacity: 0.1
            },
            shape: {
                x: 0,
                y: 0,
                width: 0,
                heigt: 0
            },
            z: 10000
        });

      
        this.zr.add(this.selectFrame)
        this.selectFrame.hide()

        this.zr.add(this)
        this.handlers = this.eventHandlers()
        this.initEventListeners()
    }
    uuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        function guid() {
            return S4() + S4() + S4() + S4()
        }
        return guid();
    }
    destory(){
        this.background.destroy()
        this.removeEventListeners()
    }
    resize(width,height){
        this.zr.resize({width,height})
        this.background.resize()
    }
    getSize(){
        return { width:this.zr.getWidth(), height:this.zr.getHeight() }
    }
    /**
     * @description: 添加基础图形
     * @param {*} node
     * @return {*}
     */
    addNode(node) {
        this.nodes.push(node);
        console.log('addNode', node)
        this.add(node);
        node.anch && node.anch.bars.forEach(bar => {
            this.add(bar);
        })
    }
    /**
     * @description: 添加dom部件
     * @param {*} domWidget
     * @return {*}
     */
    addWidget(domWidget){
        this.$cvd.emit('addWidget', domWidget.getDefaultCfg())
    }
    /**
     * @description: 添加图表组件
     * @param {*} chart
     * @return {*}
     */
    addChart(chart){
        console.log('addChart',chart)
    }
    eventHandlers(){
        return {
            onSelectNode(e){
                this.selectItem(e.node);
                this.$cvd.emit('selectNode',{node:e.node})
            },
            onClearSelectItems(){
                this.clearSelectItems();
                this.$cvd.emit('clearSelect')
            },
            onSetCanvasSize(size){
                this.resize(size.width,size.height)
            },
            onSelectWidget(e){
                let box = e.node.getBoundingRect()
                this.domFrame.boxSelect(box, e.node);
                this.domFrame.refreshBar();
                this.domFrame.show();
                this.$cvd.emit('selectNode', e)
            },
            hideWidgetFrame(){
                this.domFrame.hide()
            }
        }
    }
    removeEventListeners(){
        this.$cvd.off('canvasReady')
        this.zr.off('selectNode', this.handlers.onSelectNode)
        this.zr.off('clearSelectItems', this.handlers.onClearSelectItems)
        this.$cvd.off('setCanvasSize',this.handlers.onSetCanvasSize)
        this.$cvd.off('selectWidget',this.handlers.onSelectWidget)
        this.$cvd.off('hideWidgetFrame',this.handlers.hideWidgetFrame)
    }
    initEventListeners(){
        // canvas画布呈现，通知属性面板初始化参数
        this.$cvd.emit('canvasReady',this.getSize())
        this.zr.on('selectNode', this.handlers.onSelectNode,this)
        this.zr.on('clearSelectItems', this.handlers.onClearSelectItems,this)
        this.$cvd.on('setCanvasSize',this.handlers.onSetCanvasSize, this)
        this.$cvd.on('selectWidget',this.handlers.onSelectWidget,this)
        this.$cvd.on('hideWidgetFrame',this.handlers.hideWidgetFrame,this)
        
        let startX = 0
        let startY = 0
        let dx = 0
        let dy = 0
        let pos = null
        // let isDrag = false
        
        let mouseMove=()=>{              
            if(this.status=='selectFrame'){
                this.selectFrame.attr({
                    shape: {
                        width: dx,
                        height: dy
                    }
                });
                this.multipleSelect();
            }
            else{
                this.attr({
                    position:[pos[0]+dx,pos[1]+dy]
                });
            }
        };

        let mouseUp=()=>{
            this.selectFrame.attr({
                shape: {
                    x: 0,
                    y: 0,
                    width: 0,
                    heigt: 0
                }
            });
            this.status='';
            this.selectFrame.hide();
            //document.removeEventListener('mousedown',mouseDown);
            document.removeEventListener('mousemove',mouseMove)
            document.removeEventListener('mouseup',mouseUp)
        }
        
        this.zr.on('mousedown', (e) => {
            startX = e.offsetX
            startY = e.offsetY
            // drag = true;
            pos=this.position.slice();
            //框选
            if (!e.target) { 
               //document.addEventListener('mousedown',mouseDown);

               this.zr.trigger('clearSelectItems')
               
               if(this.status=='selectFrame'){
                 this.selectFrame.attr({
                    shape: {
                        x: startX,
                        y: startY
                    }
                 });
                 this.selectFrame.show()
               }

               document.addEventListener('mousemove',mouseMove)
               document.addEventListener('mouseup',mouseUp)
            }

            if (e.target) {
                var activeItem = this.getSelectNodes()
                activeItem.forEach(n => {
                    n.oldPos = n.position.slice()
                });

                if (e.target.nodeType == 'node') {
                    // this.multipleSelectEdges();
                }

                if(e.target.edge){
                    this.status='changeEdge'
                }
            }
        })

    }
    selectItem(n) {
        this.clearSelectItems()
        n.active()
        //window.console.log(111);
        var group = new zrender.Group()
        var box = group.getBoundingRect([n])
        this.frame.boxSelect(box, n)
        this.frame.refreshBar()
        this.frame.show()
    }
    clearSelectItems() {
    // this.status='';
        this.nodes.forEach(n => {
            n.unactive();
        });
        this.edges.forEach(n => {
            n.unactive()
        });
        this.groups.forEach(g => g.selected = false)
        this.frame.hide()
        this.domFrame.hide()
    }
     getSelectItems() {
        return this.nodes.filter(item => item.selected).concat(this.edges.filter(item => item.selected));
    }

    getSelectNodes() {
        return this.nodes.filter(item => item.selected||item.dragging);
    }

    getSelectEdges() {
        return this.edges.filter(item => item.selected);
    }
    addShape(data){
        // this.position是canvas画布位置
        data.x=data.x-this.position[0];
        data.y=data.y-this.position[1];
        try{
            if(data.image){
                data.command="image";
               // data.style=data;
            //    window.console.log(data);
            }
            var element 
            switch(data.grp){
                case 'widgets':
                    element = new DeDomWidget({type:data.command,shape:data},this)
                    this.stack.execute(new cmd.AddWidgets([element], this))
                    break
                case 'charts':
                    break
                default:
                    element = shape.getShape(data.command, data)
                    this.stack.execute(new cmd.AddNodes([element], this))
                    break
            } 
        }catch(e){
            window.console.log(e);
        }
    }
}
export default DesignEditor