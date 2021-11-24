import { globalMixin } from './global/global'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { stateMixin } from './state'
import { renderMixin } from './vdom/index'


function Vue(options) {
  this.$options = options
  this._init(options)
}

// 扩展原型 公共方法挂载原型上
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)
// 扩展静态方法
globalMixin(Vue)



// -------------  测试  ---------------
import { patch, createElm } from './vdom/patch'
import { compileToFunctions } from './compiler/index'
let vm1 = new Vue({
  data: { name: '张三' }
})
let render1 = compileToFunctions('<div id="a" style="background:red;color:orange">{{ name }}</div>')
let oldVnode = render1.call(vm1)

document.body.appendChild(createElm(oldVnode))
// ---------------------------------------------- 
let vm2 = new Vue({
  data: { name: '李四' }
})
let render2 = compileToFunctions('<div id="b" style="background:blue;color:gold">{{ name }}</div>')
let newVnode = render2.call(vm2)
console.log(newVnode);
setTimeout(_ => {
  patch(oldVnode, newVnode)
}, 2000)

// -------------  测试  ---------------


export default Vue
