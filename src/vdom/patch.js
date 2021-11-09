export function patch(oldVnode, newVnode) {
  const el = createElm(newVnode)
  const parentEle = oldVnode.parentNode
  parentEle.insertBefore(el, oldVnode.nextSibling)
  parentEle.removeChild(oldVnode)
}

function createElm(vnode) {
  const { tag, data, key, children, text } = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)

    children && children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}