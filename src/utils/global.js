import Cookies from 'js-cookie'
const TokenKey = 'KSHOP-ENUMS-MAP'

export function getEnumsMap() {
  return Cookies.get(TokenKey)
}

export function setEnumsMap(enums) {
  return Cookies.set(TokenKey, enums)
}
