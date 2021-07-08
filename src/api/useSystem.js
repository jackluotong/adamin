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

export const editInfo = (url, info) => {
  return axios.request({
    url: url,
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

export const deleteSystem = (id, code) => {
  return axios.request({
    url: `/dadmin/application/del/system/${id}/${code}`,
    method: 'get'
  })
}
