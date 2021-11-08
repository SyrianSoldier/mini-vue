import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    patch(this.$el, vnode)
  }
}
export function mountComponent(vm, el) {
  // 更新虚拟节点
  vm._update(vm._render())
}
