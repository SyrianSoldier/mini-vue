export function defineProperty(target, attr, value) {
  Object.defineProperty(target, attr, {
    enumerable: false,
    configurable: false,
    value
  })
}
export function proxy(target, data) {
  for (const key in data) {
    Object.defineProperty(target, key, {
      get() {
        return data[key]
      },
      set(newValue) {
        data[key] = newValue
      }
    })
  }
}
