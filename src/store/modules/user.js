//存缓存和取缓存都在util/auth中写好了，只需引入
import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(),  //从缓存中读取数据
  //存储用户资料
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    state.token = token
    //同步到缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    //从缓存中移除token
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}
const actions = {
  //第一个参数context,第二个参数是传入的参数

  async login(context, data) {
    //console.log("@@@@", data);
    //调用登录接口,然后返回一个token.这里直接写token就行，因为响应拦截器那处理过了，直接返回的data
    const token = await login(data)
    context.commit("setToken", token)
  },

  //获取用户基本资料
  async getUserInfo(context) {
    const result = await getUserInfo()
    context.commit("setUserInfo", result)
  },
  //退出登录
  logout(context) {
    //删除token
    context.commit("removeToken")
    //清空用户的数据
    context.commit("setUserInfo", {})
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}