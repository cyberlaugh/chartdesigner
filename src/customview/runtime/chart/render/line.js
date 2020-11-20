/*
 * @Description: 折线图
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-12 11:29:40
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-19 17:27:14
 */

import BaseChart from './_baseChart'
import lineSchema from '../schema/line'
import {loadLineBarData} from '../../api/dataLoader'

class ChartLine extends BaseChart{
    constructor(dom, cfg){
        super(dom, lineSchema, cfg) 
    }
        /**
     * @description: 根据数据源配置及传入参数param获取数据
     * @param {*} params:[{prop:'time',valueFrom:''}]    
     * @return {*}
     */
    loadData(params){
        const data = loadLineBarData(this.merge({},this.dataSource,params))
        this.fillData(data)
    }
    fillData(data){
        const { xAxisData, seriesData } = data
        let series=[]
        series.push({
            type:'line',
            data: seriesData
        })
        this.setOption({series})
        if(xAxisData){
            this.setOption({xAxis:{data:xAxisData}})
        }
        this.draw()
    }
    onEventTrigger(params,events){
        console.log('onEventTrigger', params,events)
    }
}


export default ChartLine