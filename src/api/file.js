import request from '@/utils/request'

export function getFileList() {
  return request({
    url: '/file/list'
  })
}
