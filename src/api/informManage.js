
import axios from '@/libs/api.request'

export const getInfoInform = (info) => {
  return axios.request({
    url: '/dcenter/noticeInfo/select/notice',
    method: 'post',
    data: info
  })
}
