import axios from '@/libs/api.request'

export const getInfo = (info) => {
  return axios.request({
    url: '/dadmin/white/query',
    method: 'post',
    data: info
  })
}
export const addInfo = (info) => {
  return axios.request({
    url: '/dadmin/white/create',
    method: 'post',
    data: info
  })
}
export const deleteInfo = (id) => {
  return axios.request({
    url: '/dadmin/white/remove/' + id,
    method: 'get'
  })
}
