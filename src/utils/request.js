import axios from 'axios'
import store from '@/store'
import { Message } from "element-ui";
import router from '@/router';
//创建一个新的axios实例
const service = axios.create({
  //基地址  axios区分环境
  baseURL: process.env.VUE_APP_BASE_API,
  //超时时间
  timeout: 20000,
})

//创建请求拦截器
service.interceptors.request.use((config) => {
  //注入token
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  //失败执行promise
  return Promise.reject(error)
})

//创建响应拦截器
service.interceptors.response.use((response) => {
  //axios默认包裹了data
  //console.log(response.data);
  //判断是不是blob
  if (response.data instanceof Blob) return response.data  // 返回blob对象
  const { data, success, message } = response.data  //默认json格式
  if (success) {
    return data
  } else {
    return Promise.reject(new Error(message))
  }
}, async (error) => {
  if (error.response.status === 401) {
    Message({ type: "warning", message: 'token超时' })
    //说明token超时了
    await store.dispatch("user/logout")
    //跳转到登录页
    router.push('/login')
    return Promise.reject(error)
  }
  //提示错误消息
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})
export default service