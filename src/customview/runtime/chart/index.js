/*
 * @Description: 生成图表的方法
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-12 11:43:50
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-20 11:25:42
 */

import Line from './render/line'
import Bar from './render/bar'
import Pie from './render/pie'

export default {
    prefixId:'cv-chart_',
    /**
     * @description: 
     * @param {*} type 图表类型
     * @param {*} dom dom容器 querySelecter参数形式
     * @param {*} cfg 配置
     * @return {*}
     */
    create(type,dom,cfg){
        let chart = null
        switch(type){
            case 'line':
                chart = new Line(dom,cfg)
                break;
            case 'bar':
                chart = new Bar(dom,cfg)
                break;
            case 'pie':
            case 'ring':
                chart = new Pie(dom,cfg)
        }
        return chart
    }
}