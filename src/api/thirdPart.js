import axios from '@/libs/api.request'
export const getInfoUser = (info) => {
  return axios.request({
    url: '/dcenter/userInfo/list',
    method: 'post',
    data: info
  })
}
