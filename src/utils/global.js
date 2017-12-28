const key = 'KSHOP-ENUMS-MAP'

export function getEnumsMap() {
  return localStorage.getItem(key)
}

export function setEnumsMap(enums) {
  return localStorage.setItem(key, enums)
}
