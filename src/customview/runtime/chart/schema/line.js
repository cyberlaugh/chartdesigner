/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-12 11:30:21
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-15 19:46:04
 */
const lineSchema = {
    tooltip:{
        trigger:'axis'
    },
    xAxis:{
        type: 'category',
        data:[]
    },
    yAxis:{
        type:'value'
    },
    series:[{
        data:[],
        type:'line'
    }]
}

export default lineSchema