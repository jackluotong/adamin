import axios from '@/libs/api.request'

export const getUseThreShold = (info) => {
  return axios.request({
    url: '/dadmin/applicationThreshold/query',
    method: 'post',
    data: info
  })
}

export const addUseThreShold = (info) => {
  return axios.request({
    url: '/dadmin/applicationThreshold/create',
    method: 'post',
    data: info
  })
}

export const editUseThreShold = (info) => {
  return axios.request({
    url: '/dadmin/applicationThreshold/update',
    method: 'post',
    data: info
  })
}

export const deleteUseThreShold = (info) => {
  return axios.request({
    url: `/dadmin/applicationThreshold/remove/${info}`,
    method: 'get',
    data: info
  })
}

export const cancelUseThreShold = (info) => {
  return axios.request({
    url: `/dadmin/applicationThreshold/fuseCancellation/${info}`,
    method: 'get',
    data: info
  })
}

/*

    service threshold
*/

export const getServiceThreShold = (info) => {
  return axios.request({
    url: '/dadmin/serviceThreshold/query',
    method: 'post',
    data: info
  })
}

export const addServiceThreShold = (info) => {
  return axios.request({
    url: '/dadmin/serviceThreshold/create',
    method: 'post',
    data: info
  })
}

export const editServiceThreShold = (info) => {
  return axios.request({
    url: '/dadmin/serviceThreshold/update',
    method: 'post',
    data: info
  })
}

export const deleteServiceThreShold = (info) => {
  return axios.request({
    url: '/dadmin/serviceThreshold/remove/',
    method: 'post',
    data: info
  })
}

/*
    get all app application/queryAppAll
*/

export const getAllApp = () => {
  return axios.request({
    url: '/dadmin/application/queryAppAll',
    method: 'get'
  })
}
