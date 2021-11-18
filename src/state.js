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
function initWatch(vm) { }

export function stateMixin(Vue) {
  Vue.prototype.$nextTick = function(cb) {
    nextTick(cb)
  }
}