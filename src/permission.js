// 先引入 store router ,这里访问不到this.$store,需要引入
import store from '@/store'
import router from '@/router'

// 白名单
const whiteList = ['/login', '/404']
// 利用全局前置守卫进行路由操作
router.beforeEach(async(to, from, next) => {
  // 首先判断有无token
  if (store.getters.token) {
    // token 存在 说明 处于登录状态
    // 判断去往的页面是否为登录页 是登录页 就next去首页 否则就不处理 直接放行
    // 当有token时获取用户信息
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') {
      // 就next去首页
      next('/')
    } else {
      // 直接放行
      next()
    }
  } else {
    // 没有token 判断是否处于白名单 404 和 login   处于白名单就去白名单路径 否则去login
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // login
    }
  }
})
