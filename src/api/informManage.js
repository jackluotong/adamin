
import axios from '@/libs/api.request'

export const getInfoInform = (info) => {
  return axios.request({
    url: '/dcenter/noticeInfo/select/notice',
    method: 'post',
    data: info
  })
}

export const deleteInfoInform = (info) => {
  return axios.request({
    url: `/dcenter/noticeInfo/editd/notice/${id}`,
    method: 'post',
    data: info
  })
}

export const editInfoInform = (info) => {
  return axios.request({
    url: '/dcenter/noticeInfo/edit/notice',
    method: 'post',
    data: info
  })
}

/*
    alarm page
*/
export const getInfoWarning = (info) => {
  return axios.request({
    url: '/dcenter/warningRecord/select/warning',
    method: 'post',
    data: info
  })
}

export const editInfoWarning = (info) => {
  return axios.request({
    url: '/dcenter/warningRecord/add/warning',
    method: 'post',
    data: info
  })
}

export const deleteInfoWarning = (info) => {
  return axios.request({
    url: `/dcenter /warningRecord/del/warning/${id}`,
    method: 'post',
    data: info
  })
}
