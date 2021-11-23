import { nextTick, popTarget, pushTarget } from "../until"

let id = 0
class Watcher {
  constructor(vm, exprOrFunc, callback, options) {
    this.vm = vm
    this.exprOrFunc = exprOrFunc // 渲染watcher时是updateComponent, 用户watcher时是表达式
    this.callback = callback // 渲染watcher时是updated钩子函数, 用户watcher时是监视的回调函数
    this.render = options.render || null //记录是否是渲染watcher
    this.user = options.user || null // 记录是否是用户watcher

    this.deps = [] // 记录watcher对应的依赖数据
    this.depsId = new Set() // 利用set去重的特性, 记录
    this.id = id++
    if (typeof exprOrFunc === 'function') {
      // 渲染watcher逻辑
      this.getter = exprOrFunc
    } else {
      // 用户watcher逻辑
      this.getter = () => {
        let obj = vm
        // 需要考虑表达式为'a.b.c'的形式
        let expr = this.exprOrFunc.split('.')
        for (let i = 0; i < expr.length; i++) {
          // "a.b.c.d" 从vm上取到他的值
          obj = obj[expr[i]]
        }
        return obj // 将读取的值返回
      }
    }
    // 保存老值
    this.value = this.get()
  }
  get() {
    // 每次渲染页面前标记下当前组件被哪个watcher管理
    pushTarget(this)
    const value = this.getter()
    // 渲染页面后取消标记
    popTarget()
    return value
  }
  addDep(dep) {
    // 双项添加, 组件wather记录收集依赖, 每个依赖记录自己的爹
    // 如果不重复, 便添加该dep 为了避免 watcher.deps[name,name] 出现多个同名依赖的情况, 一个属性只对应一个依赖
    if (!this.depsId.has(dep.id)) {
      this.deps.push(dep)
      dep.addSub(this)
      this.depsId.add(dep.id)
    }
  }
  update() {
    // 当有更新时, 执行异步更新策略
    queueWatcher(this)
  }
  run() {
    const oldValue = this.value
    const newValue = this.get()
    // 重置value, 本次的newValue 为 下次的oldValue
    this.value = newValue
    // 如果为用户watcher, 调用用户handler
    if (this.user) {
      this.callback.call(this, newValue, oldValue)
    }
  }
}

let queue = []
let has = {}
let pending = false
function flushSchedulerQueue() {
  console.log();
  queue.forEach(watcher => {
    watcher.run()
    if (watcher.render) { //如果为渲染watcher, 调用updated钩子
      watcher.callback.call(this)
    }
  })
  queue = []
  has = {}
  pending = false
}

function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
  }
  if (!pending) {
    pending = true
    nextTick(flushSchedulerQueue)
  }

}
export default Watcher