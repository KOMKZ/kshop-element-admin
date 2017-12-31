import request from '@/utils/request'

export function getEnumsMap() {
  return request({
    url: '/api/enums-map',
    method: 'get'
  })
}

export function getLabelsMap() {
  return request({
    url: '/api/labels',
    method: 'get'
  })
}
