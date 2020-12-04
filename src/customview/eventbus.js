/*
 * @Description: Custom View Event Bus Class
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-22 15:15:29
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-24 11:25:13
 * @Tool: Auto Generated by koroFileHeader
 */
class CVEventBus { 
    constructor() {
         this._events = Object.create(null);   
    }   
    on(event, fn, ctx) {   
      if (Array.isArray(event)) {   
        event.map(item => {   
          this.on(item, fn, ctx)
        })   
      } else {
        if(ctx){
            fn.ctx = ctx
        }
        (this._events[event] || (this._events[event] = [])).push(fn)
      }   
      return this   
    }
   
    // 执行一次
    once(event, fn, ctx) {
      function on() {   
        this.off(event, on)
        fn.apply(this, arguments) 
      }
      on.fn = fn
      this.on(event, on, ctx)
      return this   
    }
   
    off(event, fn) {   
      if (!arguments.length) {   
        this._events = Object.create(null)
        return this
      }   
      if (Array.isArray(event)) {   
        event.map(item => {   
          this.off(item, fn)   
        })   
        return this   
      }
   
      const cbs = this._events[event]   
      if (!cbs) {   
        return this   
      }
   
      if (!fn) {   
        this._events[event] = null   
        return this   
      }
   
      let cb   
      let i = cbs.length
   
      while (i--) {   
        cb = cbs[i]
        if (cb === fn || cb.fn === fn) {   
            cbs.splice(i, 1)   
            break   
        }   
      }   
      return this   
    }
   
    emit(event) {   
      let cbs = this._events[event]   
      if (cbs) {   
        const args = [].slice.call(arguments, 1)   
        cbs.map(fn => {   
          args ? fn.apply(fn.ctx || this, args) : fn.call(fn.ctx || this)   
        })   
      }   
      return this   
    }
   
}  

export default CVEventBus