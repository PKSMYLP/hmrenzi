const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.userInfo.username, // 建立用户名称的映射
  userId: state => state.user.userInfo.userId, // 用户的ID
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  hrsaasTime: state => state.user.hrsaasTime, // 登录的时间戳
  companyId: state => state.user.userInfo.companyId // 公司id
}
export default getters
