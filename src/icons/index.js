import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
console.log(req.keys()) // 导出所有路径
console.log(req('./dashboard.svg')) // 根据路径 找到对应的模块
const requireAll = requireContext => requireContext.keys().map(requireContext)
console.log(requireAll(req))
