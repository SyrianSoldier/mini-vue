import { initMixin } from './init'

function Vue(options) {
  this.$options = options
  this._init(options)
}

initMixin(Vue) //公共方法挂载原型上

export default Vue
