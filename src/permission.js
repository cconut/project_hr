//主页的权限验证

import router from "@/router"
import nprogress from "nprogress"
import 'nprogress/nprogress.css'
import store from '@/store'
//前置守卫
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    //有token   有token的话，不能再去login页面
    if (to.path === '/login') {
      //跳转到主页
      next('/')
      nprogress.done()
    } else {
      //判断是否获取过资料
      if (!store.getters.userId) {
        await store.dispatch("user/getUserInfo")
      }
      next()
    }
  } else {
    //没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next("/login")
      nprogress.done()
    }

  }
})

router.afterEach((to, from) => {
  nprogress.done()
})