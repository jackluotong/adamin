import axios from '@/libs/api.request'

export const getUseThreShold = (info) => {
  return axios.request({
    url: '/dcenter/applicationThreshold/query',
    method: 'post',
    data: info
  })
}

export const addUseThreShold = (info) => {
  return axios.request({
    url: '/dcenter/applicationThreshold/create',
    method: 'post',
    data: info
  })
}

export const editUseThreShold = (info) => {
  return axios.request({
    url: '/dcenter/applicationThreshold/update',
    method: 'post',
    data: info
  })
}

export const deleteUseThreShold = (info) => {
  return axios.request({
    url: `/dcenter/applicationThreshold/remove/${info}`,
    method: 'get',
    data: info
  })
}

export const cancelUseThreShold = (info) => {
  return axios.request({
    url: `/dcenter/applicationThreshold/fuseCancellation/${info}`,
    method: 'get',
    data: info
  })
}

/*

    service threshold
*/

export const getServiceThreShold = (info) => {
  return axios.request({
    url: '/dcenter/serviceThreshold/query',
    method: 'post',
    data: info
  })
}

export const addServiceThreShold = (info) => {
  return axios.request({
    url: '/dcenter/serviceThreshold/create',
    method: 'post',
    data: info
  })
}

export const editServiceThreShold = (info) => {
  return axios.request({
    url: '/dcenter/serviceThreshold/update',
    method: 'post',
    data: info
  })
}

export const deleteServiceThreShold = (info) => {
  return axios.request({
    url: '/dcenter/serviceThreshold/remove/',
    method: 'post',
    data: info
  })
}
