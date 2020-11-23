/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-21 17:10:46
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-22 16:31:36
 * @Tool: Auto Generated by koroFileHeader
 */
import EventBus from '@/customview/eventbus'

class BusDesignTime extends EventBus{
    constructor(){
        super()
    }
    install(Vue){
        Vue.prototype.$cvd = this
        window.$cvd = this
    }
}

const cvBusDesignTime = new BusDesignTime()

export default cvBusDesignTime