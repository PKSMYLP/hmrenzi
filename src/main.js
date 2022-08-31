import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 引入所有的自定义指令
import * as directives from '@/directives'
// 引入所有的过滤器
import * as filters from '@/filters'
import Component from '@/components'
// 打印插件
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.use(Component) // 注册自己的插件
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
// 注册自定义指令
Object.keys(directives).forEach(ele => Vue.directive(ele, directives[ele]))
// 注册过滤器
Object.keys(filters).forEach(ele => Vue.filter(ele, filters[ele]))
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
