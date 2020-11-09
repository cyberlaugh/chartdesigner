
import zrender from 'zrender';
import BackgroundLayer from './BackgroundLayer'

class DesignEditor extends zrender.Group {
    constructor(domSelector, data){
        super();
        const container = document.querySelector(domSelector)
        const width = container.offsetWidth - 4 
        const height = container.offsetHeight - 4
        this.zr = zrender.init(container,{
            renderer:'canvas',
            devicePixelRatio: 2,
            width: width<800?800:width,
            height: height<800?800:height
        });
       
        this.id=this.uuid();
        this.data = data || {};
        this.background = new BackgroundLayer(this.zr)
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
}
export default DesignEditor