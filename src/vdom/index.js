export function renderMixin(Vue) {
  Vue.prototype._c = function() {
    return createElement(...arguments)
  }
  Vue.prototype._v = function(text) {
    return createTextVnode(text)
  }
  Vue.prototype._s = function(value) {
    return value === null
      ? ''
      : typeof value === 'object'
        ? JSON.stringify(value)
        : value
  }
  Vue.prototype._render = function() {
    let render = this.$options.render
    // 将this传进去
    let vnode = render.call(this)

    return vnode
  }
}
function createElement(tag, data = {}, ...children) {
  return vnode(tag, data.key, data, children, undefined)
}
function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}
function vnode(tag, key, data, children, text) {
  // 虚拟dom节点
  return {
    tag,
    key,
    data,
    children,
    text
  }
}
