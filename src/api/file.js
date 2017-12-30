import request from '@/utils/request'

export function getFileList(params) {
  return request({
    url: '/file/list',
    params: params
  })
}

export function deleteFile(file_ids) {
  return request({
    url: '/file/delete',
    method: 'post',
    data: {
      file_ids: file_ids
    }
  })
}
