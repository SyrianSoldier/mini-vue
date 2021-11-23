import Watcher from './observer/watcher'
import { observer } from './observer/index.js'
import { nextTick, proxy } from './until.js'
export function initState(vm) {
  initProps(vm)
  initData(vm)
  initMethod(vm)
  initComputed(vm)
  initWatch(vm)
}

function initProps(vm) { }
function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data //对data是函数的情况执行处理,保证this是vm
  //开始数据劫持
  observer(data)
  //数据代理
  proxy(vm, vm._data)
}
function initMethod(vm) { }
function initComputed(vm) { }
function initWatch(vm) {
  const watch = vm.$options.watch
  // 对watch的多种写法进行兼容性处理
  // 先处理 value 为数组的情况
  for (let key in watch) {
    const handler = watch[key]

    if (Array.isArray(handler)) {
      handler.forEach(handle => { createWatcher(vm, key, handle) })
    } else {
      createWatcher(vm, key, handler)
    }
  }

  function createWatcher(vm, key, handler, options = {}) {
    // 处理options的问题
    if (typeof handler === 'object') {
      // 处理handler为配置项的问题
      options = handler
      handler = handler.handler
    }
    else if (typeof handler === 'string') {
      // 处理 handler为method方法的问题
      handler = vm.handle
    }
    // 标记为用户wacher
    options.user = true

    return vm.$watch(vm, key, handler, options)
  }
}


export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function(cb) {
    nextTick(cb)
  }
  Vue.prototype.$watch = function(vm, expOrFun, handler, options) {
    // 若是立即执行,就让他执行一下
    if (options.immediate) {
      handler()
    }
    new Watcher(vm, expOrFun, handler, options)
  }
}