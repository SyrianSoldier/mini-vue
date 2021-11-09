import { initState } from './state'
import { compileToFunctions } from './compiler/index'
import { mountComponent } from './lifecycle'
import { mergeOptions } from './until'
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    let vm = this
    // 将Vue上的options合并到this.$options上
    this.$options = mergeOptions(this.constructor.options, options)
    console.log(this.$options)
    // 对做响应式!
    initState(vm)
    // 模板渲染
    if (this.$options.el) {
      this.$mount(this.$options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const options = this.$options
    this.$el = el = document.querySelector(el)

    let template = options.template //假设有template
    if (!options.render) {
      if (el && !options.template) {
        template = el.outerHTML
      }
    }
    const render = compileToFunctions(template)
    options.render = render
    //挂载组件
    let vm = this
    mountComponent(vm, el)
  }
}
