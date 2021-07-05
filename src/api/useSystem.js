import axios from '@/libs/api.request'
/*
    use system manage
*/
export const getInfo = (info) => {
  return axios.request({
    url: '/dadmin/application/select/system',
    method: 'post',
    data: info
  })
}

export const editInfo = (info) => {
  return axios.request({
    url: '/dadmin/application/edit/system',
    method: 'post',
    data: info
  })
}

/*
    use connect manage
*/
export const getInfoConnect = (info) => {
  return axios.request({
    url: '/dadmin/application/query/system',
    method: 'post',
    data: info
  })
}

export const addConnect = (info) => {
  return axios.request({
    url: '/dadmin/application/relevance/system',
    method: 'post',
    data: info
  })
}

export const cancelConnect = (info) => {
  return axios.request({
    url: `/dadmin/application/disassociation/system/${info}`,
    method: 'get'
  })
}
