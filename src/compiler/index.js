import { htmlParser } from './parser'
import { generate } from './generate'
export function compileToFunctions(template) {
  let ast = htmlParser(template) //生成AST语法树
  let code = generate(ast) //生成render函数备用code字符串
  const render = new Function(`with(this){ return ${code} }`)
  return render
}