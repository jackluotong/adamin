import axios from '@/libs/api.request'

export const getWeight = (info) => {
  return axios.request({
    url: '/dadmin/weightInfo/select/weight',
    method: 'post',
    data: info
  })
}

export const addWeight = (info) => {
  return axios.request({
    url: '/dadmin/weightInfo/edit/weight',
    method: 'post',
    data: info
  })
}

export const deleteWeight = (info) => {
  return axios.request({
    url: '/dadmin/weightInfo/del/weight',
    method: 'post',
    data: info
  })
}

export const editWeight = (info) => {
  return axios.request({
    url: '/dadmin/weightInfo/edit/weight',
    method: 'post',
    data: info
  })
}

export const searchManufacture = (info) => {
  return axios.request({
    url: '/dadmin/tripartiteService/selectManufaName',
    method: 'post',
    data: info
  })
}

/*
    judge is longin
*/
