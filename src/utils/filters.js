import { getEnumsMap } from '@/utils/global'
export function getEnumLabel(value, name, vue) {
  const enums = getEnumsMap()
  if (enums[name] && enums[name][value]) {
    return enums[name][value]
  }
  return value
}
export { formatTime, parseTime } from '@/utils/index'
export { getLabel, getEnumMap } from '@/utils/global'
