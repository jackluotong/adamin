import HttpRequest from '@/libs/axios'
import config from '@/config'
let baseUrl = ''
switch (process.env.VUE_APP_TITLE) {
  case 'sit':
    baseUrl = config.baseUrl.sit
    break
  case 'uat':
    baseUrl = config.baseUrl.uat
    break
  case 'prod':
    baseUrl = config.baseUrl.prod
    break
  case 'dev':
    baseUrl = config.baseUrl.dev
    break
  default:
    baseUrl = config.baseUrl.dev
    break
}
console.log(baseUrl, '----baseUrl-----')
const axios = new HttpRequest(baseUrl)
export default axios
