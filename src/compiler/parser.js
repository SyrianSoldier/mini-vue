// 匹配标签属性, 三个分组, 第一个分组是属性名, 第二个分组是等号, 第三四五个分组是属性名(分别对应着"" '' 和没有引号)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配标签名
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// 匹配命名空间标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配开始标签的左尖括号
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配结束标签的右标签 >
const startTagClose = /^\s*(\/?)>/
// 匹配结束标签 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

export function htmlParser(html) {
  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      attrs,
      children: [],
      parent: null
    }
  }

  let root /* 根节点 */
  let currentParent /* 当前父节点 */
  let stack = [] /* 栈 */

  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  /* 栈帧顶部是子节点, 下一层是顶部节点的父节点 */
  function end() {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    currentParent.children.push({
      type: 3,
      text
    })
  }

  function advance(n) {
    html = html.substring(n)
  }

  while (html) {
    let textEnd = html.indexOf('<') //如果<的下标是0则代表是标签, 如果不是则代表是文本
    if (textEnd == 0) {
      const startMatch = parseStartTag(html)
      if (startMatch) {
        start(startMatch.tagName, startMatch.attrs)
        continue
      }

      const endMatch = html.match(endTag)
      if (endMatch) {
        end(endMatch[1])
        advance(endMatch[0].length)
        continue
      }
    }

    let text = null
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)
      advance(text.length)
    }
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      let attr = null
      let end = null
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        match.attrs.push({
          name: attr[1],
          value:
            attr[3] ||
            attr[4] ||
            attr[5] /* 3,4,5均是属性, 分别对应双引号,单引号,无引号写法 */
        })
        advance(attr[0].length)
      }

      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }
  return root
}
