import { observer } from './observer/index.js'

export function initState(vm) {
  initProps(vm)
  initData(vm)
  initMethod(vm)
  initComputed(vm)
  initWatch(vm)
}

function initProps(vm) {}
function initData(vm) {
  let data = vm.$options.data
  vm._data = data = typeof data === 'function' ? data.call(vm) : data //对data是函数的情况执行处理,保证this是vm
  //开始数据劫持
  observer(data)
}
function initMethod(vm) {}
function initComputed(vm) {}
function initWatch(vm) {}
