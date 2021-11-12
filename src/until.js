import Dep from "./observer/dep"

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

// 定义策略模式
const strategies = {}
const LIFE_CYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdated',
  'update',
  'beforeDestroy',
  'destroyed'
]
// 合并声明周期的逻辑
LIFE_CYCLE_HOOKS.forEach(hook => {
  /* 
    核心逻辑: 1: 没有新配置, 直接返回老配置
             2:有新配置项, 没有老配置项 返回一个包装新配置项函数的数组
            3: 新老都有. 合并数组
  */
  strategies[hook] = function(oldFn, newFn) {
    if (newFn) {
      if (oldFn) {
        return oldFn.concat(newFn)
      } else {
        return [newFn]
      }
    } else {
      return oldFn
    }
  }
})
// 合并其他API的逻辑
strategies.data = function(oldFn, newFn) {
  return newFn
}
// todo....
export function mergeOptions(oldOptions, newOptions) {
  let options = {}
  // 遍历老配置项 如: option为created, 如果没有老配置(初始化的时候) 则不会走此循环,直接循环新配置项
  for (let option in oldOptions) {
    // 合并字段
    mergeField(option)
  }
  // 遍历 新配置项
  for (let option in newOptions) {
    // 如果老配置项没有新配置项的属性
    if (!oldOptions.hasOwnProperty(option)) {
      mergeField(option)
    }
  }
  function mergeField(field) {
    // 调用不同的策略
    if (strategies[field]) {
      options[field] = strategies[field](oldOptions[field], newOptions[field])
    } else {
      options[field] = newOptions[field]
    }
  }
  return options
}
export function pushTarget(watcher) {
  Dep.target = watcher
}
export function popTarget() {
  Dep.target = null
}
