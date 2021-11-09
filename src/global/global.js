import { mergeOptions } from "../until"
export function globalMixin(Vue) {
  // mixin的周期存在Vue.options中(缓存池)
  Vue.options = {}
  Vue.mixin = function(options) {
    // 合并配置项( 将原有的mixin和正在添加的新mixin合并 )
    this.options = mergeOptions(this.options, options)
  }
}