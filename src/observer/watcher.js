import { popTarget, pushTarget } from "../until"

let id = 0
class Watcher {
  constructor(vm, updateComponent, callback, isRender) {
    this.vm = vm
    this.updateComponent = updateComponent
    this.callback = callback
    this.isRender = isRender
    this.deps = [] // 记录watcher对应的依赖数据
    this.depsId = new Set() // 利用set去重的特性, 记录
    this.id = id++
    if (typeof updateComponent === 'function') {
      this.getter = updateComponent
    }

    this.get()
  }
  get() {
    // 每次渲染页面前标记下当前组件被哪个watcher管理
    pushTarget(this)
    this.getter()
    // 渲染页面后取消标记
    popTarget()
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
    this.getter()
  }

}
export default Watcher