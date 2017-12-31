const enumKey = 'KSHOP-ENUMS-MAP'
const labelKey = 'KSHOP-LABELS-MAP'
const enums = JSON.parse(localStorage.getItem(enumKey))
const labels = JSON.parse(localStorage.getItem(labelKey))

export function getEnumsMap() {
  return enums
}

export function getEnumMap(name) {
  if (enums[name]) {
    const map = []
    Object.keys(enums[name]).forEach((key) => {
      map.push({ text: enums[name][key], value: key })
    })
    return map
  }
  return []
}

export function hasEnums() {
  return !!localStorage.getItem(enumKey)
}

export function setEnumsMap(enums) {
  return localStorage.setItem(enumKey, enums)
}

export function getLabelsMap() {
  return labels
}

export function getLabel(name) {
  if (labels[name]) {
    return labels[name]
  }
  return name
}

export function hasLabels() {
  return !!localStorage.getItem(labelKey)
}

export function setLabelsMap(labels) {
  return localStorage.setItem(labelKey, labels)
}
