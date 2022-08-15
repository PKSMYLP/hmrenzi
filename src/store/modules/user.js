import { loginApi } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken()

  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    delTokne(state) {
      state.token = null
      removeToken()
    }
  },
  actions: {
    // axios请求数据是异步的
    async login({ commit }, data) {
      const res = await loginApi(data)
      commit('setToken', res)
    }
  }
}
