import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function updateUser(u_id, data) {
  data['u_id'] = u_id
  return request({
    url: '/user/update',
    method: 'post',
    data: data
  })
}
