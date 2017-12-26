import request from '@/utils/request'

export function getEnumsMap() {
  return request({
    url: '/api/enums-map',
    method: 'get'
  })
}
