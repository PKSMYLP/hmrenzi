import request from '@/utils/request'

export const loginApi = (data) => request({
  url: '/sys/login',
  method: 'POST',
  data
})

export function logout() {

}
