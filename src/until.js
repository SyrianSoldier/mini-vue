export function defineProperty(target, attr, value) {
  Object.defineProperty(target, attr, {
    enumerable: false,
    configurable: false,
    value
  })
}
