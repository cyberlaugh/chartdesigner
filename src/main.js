/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:00:05
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-11-17 13:48:22
 */
import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import busCustomView from './customview/runtime/bus'

Vue.use(Element)

Vue.config.productionTip = false

new Vue({
  beforeCreate(){
    // cvr : custom view runtime
    Vue.prototype.$cvr = busCustomView
    window.$cvr = busCustomView
  },
  render: h => h(App),
}).$mount('#app')
