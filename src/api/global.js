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

export function getCls() {
  return request({
    url: '/classification/index',
    method: 'get'
  })
}

export function updateCls(data) {
  return request({
    url: '/classification/update',
    method: 'post',
    data: data
  })
}

export function createCls(data) {
  return request({
    url: '/classification/create',
    method: 'post',
    data: data
  })
}
