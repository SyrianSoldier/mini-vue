import { protoMethods } from './array'
import { defineProperty } from '../until'
class Observer {
  constructor(data) {
    defineProperty(data, '__ob__', this) //做标记, 是否观测过

    if (Array.isArray(data)) {
      data.__proto__ = protoMethods //对数组的方法进行拦截
      this.arrayObserver(data) //对数组中的对象类型进行观测
    } else {
      this.walk(data)
    }

    //所有的逻辑放在构造函数里,太臃肿, 封装到一个方法中去做代理
  }

  walk(data) {
    const keys = Object.keys(data)
    keys.forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
  arrayObserver(arr) {
    arr.forEach((item) => {
      observer(item)
    })
  }
}
// 对原有data(数据对象进行改造, 全部给setter,getter)
// 使用闭包 用value保存data[key]的值
// 当访问data的属性时, 实际上访问和修改的是闭包value中的值
function defineReactive(data, key, value) {
  observer(value) //如果对象的属性值仍为对象, 递归!
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      observer(newValue) //如果修改的属性依然为对象, 递归!
      value = newValue
    }
  })
}

export function observer(data) {
  // 在js中typeof null 也是object
  if (typeof data !== 'object' || typeof data === null) {
    return
  }
  if (data.__ob__) {
    return
  }
  // 真正的处理data, 放在一个类里, 封装性比较好
  new Observer(data)
}
