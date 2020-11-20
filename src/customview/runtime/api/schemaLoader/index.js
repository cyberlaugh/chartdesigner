/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-13 08:53:19
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-15 16:03:50
 */
import samplePage from './schema'
import {cloneDeep} from 'lodash'
export function getPageSchema(){
    return cloneDeep(samplePage)
}

