/*
 * @Description: 这是自定义页面运行时的总线类，兼具事件总线和组件实例管理功能
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-14 15:16:55
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-21 13:34:42
 */
import Vue from 'vue'
import { merge } from 'lodash'
const { $on: on, $off: off ,$once: once, $emit: emit, _events } = new Vue()

const busRuntime = { on,off,once,emit,_events }
const runtimeComps = {}
const getSplitIds = (id)=>{
    const idx = id.indexOf('-')    
    if(idx>0){
        return {
            idPage: id.slice(0,idx),
            idComp: id.slice(idx+1)
        }
    }else{
        return {
            idPage: id,
            idComp: '#'
        }
    }
}

busRuntime.getComp = (id) => {    
    const {idPage,idComp} = getSplitIds(id)
    return runtimeComps[idPage][idComp]
}

busRuntime.getAllComps = () => {
    return runtimeComps
}

busRuntime.addComp = (id,comp) => {
    const {idPage,idComp} = getSplitIds(id)
    if(!runtimeComps[idPage]){            
        runtimeComps[idPage] = {}
    }
    runtimeComps[idPage][idComp] = comp
    
}

busRuntime.removeComp = (id) =>{
    const {idPage,idComp} = getSplitIds(id)
    {
        if(runtimeComps[idPage]){
            delete runtimeComps[idPage][idComp]
            if(Object.keys(runtimeComps[idPage]).length === 0 || idComp === '#'){
                delete runtimeComps[idPage]
            }
        }
    }
}

busRuntime.getCompValue = function(id) {
    const comp = this.getComp(id)
    if(!comp){
        return null
    }

    if(typeof comp.getValue === 'function'){
        return comp.getValue()
    }else{
      throw `comp-${id} getValue is not implemented`
    }
 }

 busRuntime.getCompText = function(id) {
    const comp = this.getComp(id)
    if(!comp){
        return null
    }

    if(typeof comp.getValue === 'function'){
        return comp.getText()
    }else{
      throw `comp-${id} getValue is not implemented`
    }
 }

 busRuntime.bindSlots = function(comp){
     let eventName
     if(!comp.slots || comp.slots.length === 0){
         throw 'slots empty where binding'
     }
     if(typeof comp.updateSlots !== 'function'){
         throw 'updateSlots is not implemented!'
     }
    comp.slots.forEach((slot,idx) => {
        if(Array.isArray(slot.trigger)){
            for(let i=0; i<slot.trigger.length; i++){
                eventName = `${slot.from}_${slot.trigger[i]}`
                this.off(eventName,comp.updateSlots(idx,slot.get)).on(eventName, comp.updateSlots(idx,slot.get))
            }
        }else{
            eventName = `${slot.from}_${slot.trigger}`
            this.off(eventName, comp.updateSlots(idx,slot.get)).on(eventName, comp.updateSlots(idx,slot.get))
        }    
     })
 }

 busRuntime.listenEvents = function(listen,idComp){
    if(!listen || listen.length === 0){
         return
     }     
     let eventName
     const executeAction = (action)=>{
        return function(event){
            let parsedParams = null
            if(Array.isArray(action.params)){
                parsedParams = {}
                if(action.type === 'data'){
                    action.params.forEach(p=>{
                        let displayValue = ''
                        if(p.get && p.get === 'text'){
                            displayValue = this.getCompText(p.valueFrom)
                        }else{
                            displayValue = this.getCompValue(p.valueFrom)
                        }
                        parsedParams[p.prop] = displayValue
                    })
                }else if(action.type === 'chartStyle'){
                    action.params.forEach(p=>{
                        if(p.valueFrom){
                            const compValue = this.getCompValue(p.valueFrom)
                            let strp = JSON.stringify(p.prop).replace(/"\?s"/g, `"${compValue}"`).replace(/"\?v"/g,compValue)
                            merge(parsedParams,JSON.parse(strp))
                        }else{
                            merge(parsedParams,JSON.parse(JSON.stringify(p.prop)))
                        }                        
                    })
                }
            }
            const comp = this.getComp(idComp)
            if(!comp) return
            if(typeof comp[action.method] !== 'function'){
                throw `${action.method} not implemented!`
            }
            comp[action.method](parsedParams,event)
        }
     }
     listen.forEach(ls=>{
        if(Array.isArray(ls.trigger)){
            for(let i=0; i<ls.trigger.length; i++){
                eventName = `${ls.from}_${ls.trigger[i]}`
                if(Array.isArray(ls.action)){
                    ls.action.forEach(act=>{
                        this.off(eventName, executeAction(act)).on(eventName, executeAction(act))
                    })
                }
            }
        }else{
            eventName =  `${ls.from}_${ls.trigger}`
            if(Array.isArray(ls.action)){
                ls.action.forEach(act=>{
                    this.off(eventName, executeAction(act)).on(eventName, executeAction(act))
                })
            }
        }
     })
 }

export default busRuntime