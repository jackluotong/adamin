import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
import {
//   setToken,
  getToken,
  //   canTurnTo,
  setTitle
} from '@/libs/util'
import config from '@/config'
import { Message } from '_element-ui@2.15.2@element-ui'
const {
  homeName
} = config

Vue.use(Router)
const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

/* const turnTo = (to, next) => {
  if (canTurnTo(to.name, routes)) next()
  else {
    next({
      replace: true,
      name: 'error_401'
    })
  }
}
 */
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName
    })
  } else if (token && to.name !== LOGIN_PAGE_NAME) {
    next()
  } else {
    Message.info('不合适哦....')
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
