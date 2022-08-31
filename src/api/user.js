import request from '@/utils/request'
// 登录
export const loginApi = (data) => request({
  url: '/sys/login',
  method: 'POST',
  data
})

export function logout() {

}

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/** *
 *
 * 获取用户的基本信息  现在写它 完全是为了显示头像
 * **/
export const getUserDetailById = (id) =>
  request({
    url: `/sys/user/${id}`
  })

