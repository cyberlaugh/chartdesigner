/*
 * @Description: 图表渲染基类
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-12 11:57:27
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-19 17:49:40
 */
import echarts from 'echarts'
import { merge, cloneDeep } from 'lodash'

class BaseChart{
    constructor(domSelector, schema, cfg){
        this.id = cfg.id
        const dom = document.querySelector(domSelector)
        if(echarts.getInstanceByDom(dom)){
            throw new Error('instance already exists!')
        }
        this.ec = echarts.init(dom)
        if(schema){
            this.option = merge(this.getCommonOpiton(),schema)
        }else{
            this.option = this.getCommonOpiton()
        }
        // 设计器配置信息
        if(cfg.chartOption){
            merge(this.option, cfg.chartOption)
        }                
        this.dataSource = cloneDeep(cfg.dataSource)
        this.pendingToRender = true
        this.listen = cloneDeep(cfg.listen)
        this.bindListenEvents(this.listen)
        this.events = cloneDeep(cfg.events)
        this.bindEvents(this.events)
    }
    // 获取公共选项
    getCommonOpiton(){
        return {
            color:['#123ecc', '#c60928', '#10a092', '#f79f24', '#765ce5', '#91b1f2', '#ed839c', '#f7dca1', '#14a54e', '#333333']
        }
    }
    // 获取dom容器
    getDom(){
        return this.ec.getDom()
    }
    // 销毁
    dispose(){
        this.ec.dispose()
    }
    /**
     * @description: 缩放
     * @param {*} option:{ width?: number|string, height?: number|string, silent?: boolean}
     * @return {*}
     */    
    resize(option){
        this.ec.resize(option)
    }
    // 获取配置项
    getOption(){
        return this.ec.getOption()
    }
    // 只更新选项，不渲染
    setOption(newOption){
        merge(this.option,newOption)
        this.pendingToRender = true
    }
    // 监听外部事件
    bindListenEvents(listen){        
        if(listen && Array.isArray(listen) && listen.length > 0){
            window.$cvr.listenEvents(listen,this.id)
        }
    }
    // 绑定自身事件
    bindEvents(events){
        let self = this
        if(events && Array.isArray(events) && events.length > 0){
            this.option.events = {}
            events.forEach(ev => {
               this.ec.on(ev.name, function(params){
                 window.$cvr.emit(self.id+'_' + ev.name, {chartParams:params, interop:ev.interop})
               })
            })
        }
    }
    merge(t,s1,s2){
        return merge(t,s1,s2)
    }
    // 加载数据
    loadData(){

    }
    // 渲染
    draw(newOption){
        if(newOption){
            this.setOption(newOption)
        }
        this.ec.setOption(this.option)
        this.pendingToRender = false        
    }
}

export default BaseChart