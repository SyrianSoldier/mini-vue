let id = 0
class Dep {
  constructor() {
    this.id = id++
    // 订阅爹
    this.subs = []
  }
  depend() {
    // 当前watcher添加依赖(依赖收集)
    Dep.target.addDep(this)
  }
  notify() {
    // 通知watcher修改更新视图
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
}
Dep.target = null // 用来记录依赖所属的组件Watcher
export default Dep