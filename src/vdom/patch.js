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

    //更新子节点
    const oldChildren = oldVnode.children || []
    const newChildren = newVnode.children || []

    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 当新老节点都有子节点时走diff算法
      updateChildren(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) { // 即newChildren.length = 0
      // 老的有, 新的没有, 直接清空老节点
      el.innerHTML = ''
    } else if (newChildren.length > 0) {
      // 新的有老的没有, 添加节点
      newChildren.forEach(child => {
        el.appendChild(createElm(child))
      })
    }
  }
}

function isSameVnode(oldVnode, newVnode) {
  // 相同的虚拟节点的判断条件为, 相同的标签名和相同的key
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}
function getIndexMap(oldChildren) {
  let map = {}
  oldChildren.forEach((item, index) => {
    map[item.key] = index  // 映射表 A:1,B:2,C:3
  })

  return map
}
function updateChildren(oldChildren, newChildren, parent) {

  //双指针构造
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let oldStartVnode = oldChildren[0]
  let oldEndVnode = oldChildren[oldEndIndex]

  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  let newStartVnode = newChildren[0]
  let newEndVnode = newChildren[newEndIndex]
  // 暴力比对映射表
  const map = getIndexMap(oldChildren)
  // 操作中要移动双指针, 所以结束条件为指针相碰
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 头对头
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 脚对脚
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 头对脚
      patch(oldStartVnode, newEndVnode)
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    } else if (isSameVnode(newStartVnode, oldEndVnode)) {
      //// 脚对头
      patch(newStartVnode, oldEndVnode)
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
      newStartVnode = newChildren[++newStartIndex]
      oldEndVnode = oldChildren[--oldEndIndex]
    } else {
      let moveIndex = map[newStartVnode.key] //拿新的去老的中找
      if (moveIndex === undefined) { //没找到将新的加到老的开始节点前面
        parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
      } else { //找到了就复用
        let moveVnode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null //置空老节点
        parent.insertBefore(moveVnode.el, oldStartVnode.el)
        patch(moveVnode, newStartVnode)
      }
      // 不管怎么样 移动指针, 老指针不动, 新指针后移
      newStartVnode = newChildren[++newStartIndex]
    }
  }
  // 若有多余, 新的剩下插入, 老的剩下删除
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      let ele = newChildren[newEndIndex + 1] === null ? null : newChildren[newEndIndex + 1]
      parent.insertBefore(createElm(newChildren[i], el))
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const child = oldChildren[i]
      if (child != undefined) {
        parent.removeChild(child.el)
      }
    }
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