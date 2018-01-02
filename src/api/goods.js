import request from '@/utils/request'

export function createGoods(data) {
  return request({
    url: '/goods/create',
    method: 'post',
    data: data
  })
}
