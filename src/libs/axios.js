import axios from 'axios'
/* import store from '@/store'
 */
import { getToken } from '@/libs/util'
import Res from '@/libs/global'
import { Message } from 'iview'
import router from '../router/index'
/* const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
} */
class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'X-Token': getToken(),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
    //   Spin.hide()
    }
  }
  interceptors (instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
    // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show()
      }
      this.queue[url] = true
      return config
    }, error => {
      return Promise.reject(error)
    })

    instance.interceptors.response.use(res => {
      this.destroy(url)
      switch (res.data.code) {
        case Res.SUCCESS:
          const { data, status } = res
          return { data, status }
        case Res.BAD_REQUEST:
          Message.error(res.data.message)
          break
        case Res.UNAUTHORIZED:
          Message.error(res.data.message)
          break
        case Res.FORBIDDEN:
          Message.error(res.data.message)
          router.push({
            name: 'login'
          })
          break
        case Res.NOT_FOND:
          Message.error(res.data.message)
          break
        case Res.METHOD_NOT_ALLOWED:
          Message.error(res.data.message)
          break
        case Res.NOT_ACCEPTABLE:
          Message.error(res.data.message)
          break
        case Res.CODE_EXISTED:
          Message.error(res.data.message)
          break
        case Res.ID_NOT_EMPTY:
          Message.error(res.data.message)
          break
        case Res.UNSUPPORTED_MEDIA_TYPE:
          Message.error(res.data.message)
          break
        case Res.USED_IN_WEIGHTS:
          Message.error(res.data.message)
          break
        case Res.M_USING:
          Message.error(res.data.message)
          break
        case Res.SERVER_ERROR:
          Message.error(res.data.message)
          break
        case Res.EMPTY_ERROR:
          Message.error(res.data.message)
          break
        case Res.EMPTY_VALUE_ERROR:
          Message.error(res.data.message)
          break
        case Res.KEY_VALUE_ERROR:
          Message.error(res.data.message)
          break
        case Res.VALUES_ERROR:
          Message.error(res.data.message)
          break
        case Res.PARAMS_ERROR:
          Message.error(res.data.message)
          break
        case Res.CREATE_ERROR:
          Message.error(res.data.message)
          break
        case Res.REMOVE_ERROR:
          Message.error(res.data.message)
          break
        case Res.REMOVE_ERROR1:
          Message.error(res.data.message)
          break
        case Res.REMOVE_ERROR2:
          Message.error(res.data.message)
          break
        case Res.DOWNLOAD_ERROR:
          Message.error(res.data.message)
          break
        case Res.EXIST_THRESHOLD:
          Message.error(res.data.message)
          break
        case Res.AFTERS_REPEATEDS:
          Message.error(res.data.message)
          break
        case Res.CODES_REPEATEDS:
          Message.error(res.data.message)
          break
        case Res.RELEVANCE_REPEATEDS:
          Message.error(res.data.message)
          break
        case Res.WEIGHT_REPEATEDS:
          Message.error(res.data.message)
          break
        default:
          Message.error(res.data.message)
          this.destroy(url)
          break
      }
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
      //   addErrorLog(errorInfo)
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
