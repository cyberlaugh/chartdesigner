/*
 * @Description: 
 * @Version: 1.0
 * @Autor: Luan Feng
 * @Date: 2020-11-07 10:00:05
 * @LastEditors: Luan Feng
 * @LastEditTime: 2020-12-03 09:01:26
 */
import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import Element from 'element-ui'
import busRuntime from './customview/runtime/bus'
import busDesigntime from './customview/designtime/bus'
import store from './store'
import './assets/fonticon/iconfont.css'

Vue.use(Element)
Vue.use(busDesigntime)
Vue.config.productionTip = false

new Vue({
  beforeCreate(){
    // cvr : custom view runtime
    Vue.prototype.$cvr = busRuntime
    window.$cvr = busRuntime
  },
  store,
  render: h => h(App),
}).$mount('#app')
