export function getEnumLabel(value, name, vue) {
  const enums = vue.$store.getters.enums
  if (enums[name] && enums[name][value]) {
    return enums[name][value]
  }
  return value
}
