import request from '@/utils/request'

export function login(u_email, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      u_email,
      password,
      type: 'token'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/get-info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
