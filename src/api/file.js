import request from '@/utils/request'

export function getFileList(params) {
  return request({
    url: '/file/list',
    params: params
  })
}
