/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-16 16:57:26
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-20 11:16:17
 * @Tool: Auto Generated by koroFileHeader
 */
const pieSchema = {
    // 普通饼图
    pie:{
        tooltip:{
            trigger:'item'
        },
        legend:{
            bottom:10,
            left:'center'
        },
        series:[{
            type:'pie',
            radius:'65%',
            selectedMode:'single',
        }]
    },
    // 环形图
    ring:{
        tooltip:{
            trigger:'item'
        },
        legend:{
            left:10,
            orient:'vertical'
        },
        series:[{
            type:'pie',
            radius:['50%','70%'],
            label:{
                show:false,
                position:'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            }
        }]
    }
}

export default pieSchema