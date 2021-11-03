const oldArrayMethods = Array.prototype
const protoMethods = Object.create(oldArrayMethods)
const methods = ['pop', 'push', 'unshift', 'shift', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
  protoMethods[method] = function (...args) {
    let inserted = null
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    this.__ob__.arrayObserver(inserted)
    return oldArrayMethods[method].apply(this, args) //执行原方法逻辑
  }
})

export { protoMethods }
