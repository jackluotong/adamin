import axios from '@/libs/api.request'

export const getManufacture = (info) => {
  return axios.request({
    url: '/dadmin/manufacturerInfo/query',
    method: 'post',
    data: info
  })
}

export const addManufacture = (info) => {
  return axios.request({
    url: '/dadmin/manufacturerInfo/create',
    method: 'post',
    data: info
  })
}
export const editManufacture = (info) => {
  return axios.request({
    url: '/dadmin/manufacturerInfo/update',
    method: 'post',
    data: info
  })
}
export const deleteManufacture = (info) => {
  return axios.request({
    url: `/dadmin/manufacturerInfo/remove/${info}`,
    method: 'get',
    data: info
  })
}

/*
    third service manage
*/

export const getThirdService = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/query',
    method: 'post',
    data: info
  })
}

export const addThirdService = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/create',
    method: 'post',
    data: info
  })
}
export const editThirdService = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/update',
    method: 'post',
    data: info
  })
}
export const deleteThirdService = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/remove',
    method: 'post',
    data: info
  })
}

export const toggle = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/updateServiceStatus',
    method: 'post',
    data: info
  })
}
