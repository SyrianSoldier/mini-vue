const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = ''
  // 循环属性
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    // 如果是 style 需要单独判断
    if (attr.name == 'style') {

      let obj = {}
      // 通过 分割 ; 来讲 style 分成 数组
      attr.value.split(';').forEach(item => {
        // 再通过 分割 ： 将键值保存
        const [key, value] = item.split(':');
        obj[key] = value;
      });
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  /*  删除最后的 逗号， slice(start,end)
  start 必需。规定从何处开始选取。如果是负数，那么它规定从数组尾部开始算起的位置。也就是说，-1 指最后一个元素，-2 指倒数第二个元素，以此类推。
  end	可选。规定从何处结束选取。如果没有指定该参数，那么切分的数组包含从 start 到数组结束的所有元素。如果这个参数是负数，那么它规定的是从数组尾部开始算起的元素。 */
  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  const children = el.children;
  if (children) { //将子元素用逗号拼接
    return children.map(child => gen(child)).join(',')
  }
}

function gen(node) {
  if (node.type == 1) {
    // 元素
    return generate(node)
  } else {
    let text = node.text;

    // 不带 花括号的文本
    if (!defaultTagRE.test(text)) {
      // JSON.stringify 才能将 文本带上 双引号，不然就会被解析为 变量
      return `_v(${JSON.stringify(text).trim()})`
    }

    // 带 花括号的文本需要单独判断  e{{a}} b {{c}} d
    const tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0; //全局的正则需要每次设置 前置为0
    let match, index; //每次匹配到的结果

    while (match = defaultTagRE.exec(text)) {
      //match     0: "{{a.b}}"   1: "a.b"   groups: undefined   index: 5   input: "hello{{a.b}} world {{c.d}}"
      index = match.index;
      // 如果 index > lastindex 说明前面有文本
      if (index > lastIndex) {
        //放进去
        tokens.push(JSON.stringify(text.slice(lastIndex, index)).trim())
      }
      tokens.push(`_s(${match[1].trim()})`)
      // 索引换成 文本的索引加上 当前的长度
      lastIndex = index + match[0].length
    }
    // 如果 lastindex 小于文本总长度，说明最后还有文本
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)).trim())
    }
    return `_v(${tokens.join('+')})`
  }
}

export function generate(el) {
  const children = genChildren(el)
  const code = `_c("${el.tag}",${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${children ? `,${children}` : ''
    })`
  return code
}