// 匹配mustache语法 {{}}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// 解析属性
function genProps(attrs) {
  let str = ''
  for (let i = 0, attr; (attr = attrs[i++]); ) {
    if (attr.name === 'style') {
      let obj = {}
      //attr.name示例 "color:red;height:200px"
      attr.value.split(';').forEach((item) => {
        //解构赋值,示例: let [key,value]=['color','red']
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}` //去除字符传最后的逗号
}

function genChildren(children) {
  if (!children) return
  // 区分不同的child节点, 做不同的处理,(成字符串)
  return children.map((child) => gen(child)).join(',')
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  }
  // node === 3时
  let text = node.text
  if (!defaultTagRE.test(text)) {
    return `_v(${JSON.stringify(text)})`
  } else {
    // 当有mustache语法时{{}}
    let lastIndex = (defaultTagRE.lastIndex = 0)
    let match, index
    let tokens = []
    while ((match = defaultTagRE.exec(text))) {
      index = match.index
      if (lastIndex < index) {
        tokens.push(`${JSON.stringify(text.slice(lastIndex, index))}`)
        lastIndex = match[0].length + index
      }
      tokens.push(`${match[1].trim()}`)
    }
    // 当匹配完成时, 还有可能后面有字符串
    if (text.length > lastIndex) {
      tokens.push(`${text.slice(lastIndex)}`)
    }
    return `_v(${tokens.join('+')})`
  }
}

export function generate(ast) {
  let code = ``
  let attrs = ast.attrs
  let children = ast.children
  // 目标字符串: '_c('div',{ id:'box',style:{ color:'red' } },_v('hello'+name),_c('div',undefined,_v('你好,李银河'))'
  code = `_c("${ast.tag}",${attrs.length ? genProps(attrs) : 'undefined'},${
    children ? genChildren(children) : ''
  })`
  return code
}
