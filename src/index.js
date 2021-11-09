import { globalMixin } from './global/global'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'


function Vue(options) {
  this.$options = options
  this._init(options)
}

// 扩展原型 公共方法挂载原型上
initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
// 扩展静态方法
globalMixin(Vue)
export default Vue
