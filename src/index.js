import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vdom/index'

function Vue(options) {
  this.$options = options
  this._init(options)
}

initMixin(Vue) //公共方法挂载原型上
renderMixin(Vue)
lifecycleMixin(Vue)
export default Vue
