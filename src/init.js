import { initState } from './state'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    let vm = this
    // 对做响应式!
    initState(vm)
  }
}
