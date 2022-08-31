// 该文件负责所有的公共的组件的全局注册   Vue.use
// Vue.use 这个方法 注册全局组件
// import PageTools from './PageTools'
// 对象形式
// export default {
//   install(Vue) {
//     //  注册全局的通用栏组件对象
//     Vue.component('PageTools', PageTools)
//   }
// }
// 函数形式
// export default (Vue) => {
//   Vue.component('PageTools', PageTools)
// }

// require.context(路径，是否查看子目录，正则) ==》返回一个函数
const requireComponent = require.context('./', true, /\.vue$/)
// const res = requireComponent.keys().map(ele => requireComponent(ele))
// // map接收函数时，会自动接收ele,并返回函数的返回值
// console.log(requireComponent('./PageTools/index.vue'))
const res = requireComponent.keys().map(requireComponent)
// console.log(res)
export default (Vue) => {
  res.forEach(ele => {
    //  ele.default.name 组件名 ，ele.default 组件对象
    Vue.component(ele.default.name, ele.default)
  })
}
