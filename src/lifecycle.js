import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    patch(this.$el, vnode)
  }
}
export function mountComponent(vm, el) {
  // 更新虚拟节点
  callHooks(vm, 'berforeMount')
  // vm_render 将render字符串执行, 返回vnode
  // vm_update
  vm._update(vm._render())
  callHooks(vm, 'Mounted')
}
export function callHooks(vm, hook) {
  // 取出声明周期数组
  const handlers = vm.$options[hook]
  if (handlers) {
    for (let i = 0, handler; handler = handlers[i++];) {
      handler.call(vm)
    }
  }
}