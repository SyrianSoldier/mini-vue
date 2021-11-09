## 分支功能介绍

```js
1. arrayReactive:
  完成了Vue构造函数的导出
  对data的数据劫持
  数组方法的拦截
  将data中的属性代理到vm上

2. render:
  完成了AST语法树的语法分析(属性只解析了常规属性, 未解析vue指令)

3. render2:
  将parserHTML方法抽到parser.js中
  完成了根据AST语法树生成render函数

4. renderMixin
  完成了_c,_s,_v,mountComponent方法
  完成了页面的初渲染

5. mixin
  完成了对声明周期的全局混入
  如 Vue.mixin({ created(){} })
```
