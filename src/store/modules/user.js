import { loginApi, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {},
    hrsaasTime: ''
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    delToken(state) {
      state.token = null
      removeToken()
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = JSON.parse(JSON.stringify(userInfo))
      // { ...userInfo } 也是浅拷贝 和 userInfo 是不同的两个对象， 他们本质指向的地址是不一致的
      // 但是直接赋值的话 state.userInfo 和 userInfo 本质指向的地址是一致的
      // 如果 userInfo 的这个对象在给别人 就导致了Vuex.state.user.userInfo 和 外界的值 就执向同一个了

    // 彻底 解决这个问题 深拷贝  JSON.parse(JSON.stringify(userInfo))
      // 拷贝时 不能让外界能够修改state的数据
    },
    // 删除用户信息
    reomveUserInfo(state) {
      state.userInfo = {}
    },
    // 获取登录时的时间戳
    sethrsaasTime(state, time) {
      state.hrsaasTime = time
    }
  },
  actions: {
    // axios请求数据是异步的
    async login({ commit }, data) {
      const res = await loginApi(data)
      commit('setToken', res)
      commit('sethrsaasTime', +new Date())
    },
    // 获取用户资料action
    async getUserInfo({ commit }) {
      const result = await getUserInfo() // 获取返回值
      const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
      const baseResult = { ...baseInfo, ...result }
      commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
      return baseResult // 这里为什么要返回 为后面埋下伏笔  不要 return  防止外部数据不改变vuex的数据
    },
    // 退出登录
    logout({ commit }) {
      commit('delToken')
      commit('reomveUserInfo')
    }
  }
}
