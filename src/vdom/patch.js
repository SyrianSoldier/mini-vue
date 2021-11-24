export function patch(oldVnode, newVnode) {
  if (oldVnode.nodeType === 1) {
    // 当是初渲染时...
    // 初渲染时, 第一个参数传的是$el 为真实DOM, 所以有nodeType
    const el = createElm(newVnode)
    const parentEle = oldVnode.parentNode
    parentEle.insertBefore(el, oldVnode.nextSibling)
    parentEle.removeChild(oldVnode)
    return el
  } else {
    // 第一个参数为vnode时, 即新旧节点对比
    if (oldVnode.tag !== newVnode.tag) {
      // 如果两个节点的标签都不一样就不复用了, 直接替换
      const oldEl = oldVnode.el
      const newEl = createElm(newVnode)
      return oldVnode.el.parentNode.replaceChild(newEl, oldEl)
    }

    // 走到这里 新旧vnode的标签名是一样的
    // 接着判断节点为文本节点的情况
    // 文本节点的tag为undefined
    if (!oldVnode.tag) {
      if (oldVnode.text !== newVnode.text) {
        return oldVnode.el.textContent = newVnode.text
      }
    }

    // 走到这里 标签名相同, 且不是文本节点, 开始属性复用, 子节点复用
    // 属性复用
    // 将老节点赋值给新节点, 比对完成后直接操作新节点上的属性

    let el = newVnode.el = oldVnode.el
    updateProperties(newVnode, oldVnode)
  }
}
function updateProperties(newVnode, oldVnode = {}) {
  const el = newVnode.el,
    newAttrs = newVnode.data || {},
    oldAttrs = oldVnode.data || {}
  // 老节点有该属性新节点没有, 删除
  for (let key in oldAttrs) {
    if (!newAttrs[key]) {
      el.removeAttribute(key)
    }
  }
  const newStyle = newAttrs.style
  const oldStyle = oldAttrs.style
  for (let key in oldStyle) {
    // 与上方相同的逻辑, 单独处理style
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  // 新节点的属性, 全部覆盖掉
  for (let key in newAttrs) {
    if (key === 'style') {
      const styles = newAttrs[key]
      for (let k in styles) {
        el.style[k] = styles[k]
      }
    }
    else if (key === 'class') {
      el.className = newAttrs[key]
    }
    else {
      el.setAttribute(key, newAttrs[key])
    }
  }
}
export function createElm(vnode) {
  const { tag, data, key, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    updateProperties(vnode)

    children && children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}