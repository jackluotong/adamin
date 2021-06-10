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
    url: `/dcenter/manufacturerInfo/remove/${info}`,
    method: 'get',
    data: info
  })
}

/*
    third service manage
*/

export const getThirdService = (info) => {
  return axios.request({
    url: '/dcenter/tripartiteService/query',
    method: 'post',
    data: info
  })
}

export const addThirdService = (info) => {
  return axios.request({
    url: '/dcenter/tripartiteService/create',
    method: 'post',
    data: info
  })
}
export const editThirdService = (info) => {
  return axios.request({
    url: '/dcenter/tripartiteService/update',
    method: 'post',
    data: info
  })
}
export const deleteThirdService = (info) => {
  return axios.request({
    url: '/dcenter/tripartiteService/remove',
    method: 'post',
    data: info
  })
}

export const toggle = (info) => {
  return axios.request({
    url: '/dcenter/tripartiteService/updateServiceStatus',
    method: 'post',
    data: info
  })
}
