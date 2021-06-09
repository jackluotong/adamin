import axios from '@/libs/api.request'

export const getInfoDetails = (info) => {
  return axios.request({
    url: '/dcenter/requestRecord/query',
    method: 'post',
    data: info
  })
}
