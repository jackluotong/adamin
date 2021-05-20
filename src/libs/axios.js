import axios from 'axios'
import store from '@/store'
import { getToken } from '@/libs/util'
import Res from '@/libs/global'
import { Message } from 'iview'
// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'token': getToken()
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      if (res.data.code === Res.SUCCESS) {
        const { data, status } = res
        return { data, status }
      } else if (res.data.code === Res.ERROR) {
        Message.error(res.data.message)
      } else if (res.data.code === Res.BAD_REQUEST) {
        Message.error(res.data.message)
      } else if (res.data.code === Res.FORBIDDEN) {
        Message.error(res.data.message)
      } else if (res.data.code === Res.UNAUTHORIZED) {
        Message.error(res.data.message)
        commit('setToken', '')
        commit('setAccess', [])
        this.$router.push({
          name: 'login'
        })
      } else {
        Message.error(res.data.message)
      }
      this.destroy(url)
      return Promise.reject(res.data.message)
    }, error => {
      this.destroy(url)
      let errorInfo = error.response
      if (('' + errorInfo.data.status) === Res.NOT_FOND) {
        Message.error('接口未找到，请检查-->' + errorInfo.data.path)
        return Promise.reject(error)
      }
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      addErrorLog(errorInfo)
      return Promise.reject(error)
    })
  }
  request (options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
