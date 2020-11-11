
import zrender from 'zrender';
import BackgroundLayer from './BackgroundLayer'
import * as cmd from './command';
import Stack from './stack';
import shape from './shape';

class DesignEditor extends zrender.Group {
    constructor(domSelector, data){
        super();
        const container = document.querySelector(domSelector)
        const width = container.offsetWidth - 4 
        const height = container.offsetHeight - 4
        this.zr = zrender.init(container,{
            renderer:'canvas',
            devicePixelRatio: 1,
            width: width<800?800:width,
            height: height<800?800:height
        });
       
        this.id=this.uuid();
        this.data = data || {};
        this.stack = new Stack(this.data.stackStep || 50);
        this.nodes = [];
        this.background = new BackgroundLayer(this.zr)
        this.zr.add(this);
    }
    uuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        function guid() {
            return S4() + S4() + S4() + S4();
        }
        return guid();
    }
    resize(width,height){
        this.zr.resize({width,height})
        this.background.resize()
    }
    getSize(){
        return { width:this.zr.getWidth(), height:this.zr.getHeight() }
    }
    addNode(node) {
        this.nodes.push(node);
        this.add(node);
        node.anch && node.anch.bars.forEach(bar => {
            this.add(bar);
        });
    }
    addShape(data){
        data.x=data.x-this.position[0];
        data.y=data.y-this.position[1];
        try{
            if(data.image){
                data.command="image";
               // data.style=data;
            //    window.console.log(data);
            }
            var node = shape.getShape(data.command, data);
            this.stack.execute(new cmd.AddNodes([node], this));
        }catch(e){
            window.console.log(e);
        }
    }
}
export default DesignEditor