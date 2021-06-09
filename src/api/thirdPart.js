import axios from '@/libs/api.request'

export const getManufacture = (info) => {
  return axios.request({
    url: '/dcenter/manufacturerInfo/query',
    method: 'post',
    data: info
  })
}

export const addManufacture = (info) => {
  return axios.request({
    url: '/dcenter/manufacturerInfo/create',
    method: 'post',
    data: info
  })
}
export const editManufacture = (info) => {
  return axios.request({
    url: '/dcenter/manufacturerInfo/update',
    method: 'post',
    data: info
  })
}
export const deleteManufacture = (info) => {
  return axios.request({
    url: '/dcenter/manufacturerInfo/remove',
    method: 'post',
    data: info
  })
}
