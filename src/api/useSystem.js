import axios from '@/libs/api.request'
export const getInfo = (info) => {
  return axios.request({
    url: '/dcenter/application/select/system',
    method: 'post',
    data: info
  })
}

export const editInfo = (info) => {
  return axios.request({
    url: '/dcenter/application/edit/system',
    method: 'post',
    data: info
  })
}
