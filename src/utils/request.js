import axios from 'axios'
import { Message } from 'element-ui'

import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'
// 设置token 有效时间
const timeOut = 3600

// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = store.getters.hrsaasTime // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > timeOut
}
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor  请求拦截器
service.interceptors.request.use(config => {
  // 添加token
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // 判断token 是否过期
      store.dispatch('user/logout')
      router.push('/login')
      // Message.error('token过期了')
      return Promise.reject(new Error('token过期了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

// response interceptor 响应拦截器
service.interceptors.response.use(
  response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //   要根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
      Message.error(message || '')
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // error 信息 里面 response的对象
    // if (error.response && error.response.data && error.response.data.code === 10002)
    if (error.response?.data?.code === 10002) {
      // 当等于10002的时候 表示 后端告诉我token超时了
      store.dispatch('user/logout') // 登出action 删除token
      router.push('/login')
    } else {
      Message.error(error.message) // 提示错误信息
    }
    return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
  }
)

export default service
