import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'iview'
import {
  getToken,
  setTitle
} from '@/libs/util'
// import config from '@/config'
import { Message } from '_element-ui@2.15.2@element-ui'
// const { homeName } = config

Vue.use(Router)
const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({ routes, mode: 'hash' })
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token) {
    if (to.name === LOGIN_PAGE_NAME) {
      next()
    } else {
      next({
        name: LOGIN_PAGE_NAME
      })
    }
  } else {
    if (sessionStorage.getItem('permission') === null) {
      if (to.name !== LOGIN_PAGE_NAME) {
        Message.info('请重新登录目前没权限')
        next({
          name: LOGIN_PAGE_NAME
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
