import axios from '@/libs/api.request'

export const getInfoDetails = (info) => {
  return axios.request({
    url: '/dadmin/requestRecord/query',
    method: 'post',
    data: info
  })
}

export const exportTable = (info) => {
  return axios.request({
    url: `/dadmin/requestRecord/export/${info}`,
    method: 'get'
  })
}
