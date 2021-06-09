import axios from '@/libs/api.request'

export const getWeight = (info) => {
  return axios.request({
    url: '/dcenter/weightInfo/select/weight',
    method: 'post',
    data: info
  })
}

export const addWeight = (info) => {
  return axios.request({
    url: '/dcenter/weightInfo/edit/weight',
    method: 'post',
    data: info
  })
}

export const deleteWeight = (info) => {
  return axios.request({
    url: '/dcenter/weightInfo/edit/weight',
    method: 'post',
    data: info
  })
}

export const editWeight = (info) => {
  return axios.request({
    url: '/dcenter/weightInfo//edit/weight',
    method: 'post',
    data: info
  })
}
