import zrender from 'zrender';
// import { debounce } from 'lodash'
class DomFrame {
    constructor(editor) {
        //   super();
        this.editor=editor;
        this.w = 8;
        this.isShow=true;
        this.createBar();
        this.initEvent();
        this.hide();
    }
    addTo(zr) {
        this.zr = zr;
        zr.add(this.lefttopbar);
        zr.add(this.leftbottombar);
        zr.add(this.righttopbar);
        zr.add(this.rightbottombar);
        zr.add(this.frame);
    }
    createBar() {
        var w = this.w;
        this.frame = new zrender.Rect({
            style: {
                fill: 'transparent'
            }
        });
        this.lefttopbar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'nw-resize',
            z: 30001
        })
        this.righttopbar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'ne-resize',
            z: 30001
        })
        this.leftbottombar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'sw-resize',
            z: 30001
        })
        this.rightbottombar = new zrender.Rect({
            style: {
                fill: '#fff',
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                width: w,
                height: w
            },
            draggable: true,
            cursor: 'se-resize',
            z: 30001
        })
        this.hide();
    }
    hide() {
        if(this.isShow){
            this.lefttopbar.hide();
            this.leftbottombar.hide();
            this.righttopbar.hide();
            this.rightbottombar.hide();
            this.frame.hide();
            this.isShow=false;
        }
    }
    show() {
        if(!this.isShow){
            this.lefttopbar.show();
            this.leftbottombar.show();
            this.righttopbar.show();
            this.rightbottombar.show();
            this.frame.show();
            this.isShow=true;
        }
    }
    boxSelect(box, item) {
        this.boxItem = item;
        box.x = box.x - 5;
        box.y = box.y - 5;
        box.width = box.width + 12;
        box.height = box.height + 12;
        this.box = box;
        this.frame.attr({
            position: [box.x, box.y],
            style: {
                stroke: 'red',
                lineWidth: 1
            },
            shape: {
                x: 0,
                y: 0,
                width: box.width,
                height: box.height
            }
        });

        // this.refreshBar();
        this.show();
    }
    refreshBar() {
        var w = this.w;
        // window.console.log(-w/2,this.lefttopbar);
        this.lefttopbar.attr({
            position: [this.box.x, this.box.y],
            shape: {
                x: -w,
                y: -w
            }
        });

        this.righttopbar.attr({
            position: [this.box.x + this.box.width, this.box.y],
            shape: {
                x: 0,
                y: -w
            }
        });

        this.leftbottombar.attr({
            position: [this.box.x, this.box.y + this.box.height],
            shape: {
                x: -w,
                y: 0
            }
        });

        this.rightbottombar.attr({
            position: [this.box.x + this.box.width, this.box.y + this.box.height],
            shape: {
                x: 0,
                y: 0
            }
        });
    }

    changBoxSize() {
        //this.groupItem.eachChild((child)=>{
        var box = this.box;
        this.editor.$cvd.emit('changeWidget',{id:this.boxItem.id,style:{
            top: box.y,
            left: box.x,
            width: box.width,
            height: box.height
        }})
    }

    initEvent() {
        var that = this;
        var  drag = false, sx, sy, x,y,width,height;
        var bars = [this.lefttopbar, this.leftbottombar, this.righttopbar, this.rightbottombar];

        bars.forEach((bar, i) => {
            bar.on('dragstart', function (e) {
                // e.preventDefault()                                
                that.editor.status='resizeNode'
               // pos = this.position.slice();
                x  = that.box.x;
                y  = that.box.y;
                width  = that.box.width;
                height = that.box.height;
                drag = true;
                sx = e.offsetX;
                sy = e.offsetY;

            });

            bar.on('drag', function (e) {
                if (drag) {
                    var dx = e.offsetX - sx;
                    var dy = e.offsetY - sy;
                    if (i == 0) {
                        that.box.x = x + dx;
                        that.box.y = y + dy;
                        that.box.width = width - dx;
                        that.box.height = height - dy;
                    } else if (i == 1) {
                        that.box.x = x + dx;
                        that.box.y = y;
                        that.box.width = width - dx;
                        that.box.height = height + dy;
                    } else if (i == 2) {
                        that.box.x = x;
                        that.box.y = y + dy;
                        that.box.width = width + dx;
                        that.box.height = height - dy;
                    } else {
                        that.box.x = x;
                        that.box.y = y;
                        that.box.width = width + dx;
                        that.box.height = height + dy;
                        //window.console.log(x,y);
                    }
                    if(that.box.width<0){
                        that.box.width = 0
                    }
                    if(that.box.height<0){
                        that.box.height = 0
                    }
                    // this.attr({
                    //     position: [pos[0] + dx, pos[1] + dy]
                    // })
                    // window.console.log(dx,dy)
                   
                    that.changBoxSize();
                    that.boxSelect(that.box, that.boxItem);
                    that.refreshBar()
                }
            });

            bar.on('dragend', function () {
                let box={
                    x: that.box.x + 5,
                    y: that.box.y + 5,
                    width: that.box.width - 12,
                    height: that.box.height - 12
                }
                that.editor.$cvd.emit('resizeWidget',{ id:that.boxItem.id, box })
                drag = false;
                that.editor.status=''
            });

        });

        document.addEventListener('mouseup', () => {
            if(drag){
                drag = false;
                this.editor.status=''
            }
        })
    }
}

export default DomFrame;