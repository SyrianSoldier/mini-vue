import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    this.$el = patch(this.$el, vnode) // patch将虚拟DOM生成, 并替换原DOM
  }
}
export function mountComponent(vm, el) {
  // 更新虚拟节点
  const updateComponent = () => {
    vm._update(vm._render())
  }
  // 每一个组件有一个唯一的观察者
  callHooks(vm, 'berforeMount')
  new Watcher(vm, updateComponent, () => { callHooks(vm, 'updated') }, { render: true })
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