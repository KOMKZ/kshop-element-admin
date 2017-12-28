const key = 'KSHOP-ENUMS-MAP'

export function getEnumsMap() {
  return localStorage.getItem(key)
}

export function getEnumMap(name, enums) {
  if (enums[name]) {
    const map = []
    Object.keys(enums[name]).forEach((key) => {
      map.push({ text: enums[name][key], value: key })
    })
    return map
  }
  return []
}

export function setEnumsMap(enums) {
  return localStorage.setItem(key, enums)
}
