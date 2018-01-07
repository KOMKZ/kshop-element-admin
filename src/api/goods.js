import request from '@/utils/request'

export function createGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data: data
  })
}

export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: params
  })
}

export function getGoods(g_id, params = {}) {
  params['g_id'] = g_id
  return request({
    url: '/goods/view',
    method: 'get',
    params: params
  })
}

export function updateGoods(data) {
  return request({
    url: '/goods/update',
    method: 'post',
    data: data
  })
}

export function getClsAttrs(params) {
  return request({
    url: '/goods/cls-attrs',
    method: 'get',
    params: params
  })
}

export function createClsAttr(data) {
  return request({
    url: '/goods/create-cls-attr',
    method: 'post',
    data: data
  })
}

export function deleteClsAttr(g_atr_id) {
  return request({
    url: '/goods/delete-cls-attr',
    method: 'post',
    data: { g_atr_id }
  })
}
