function AVue(options) {
  this._data        = options.data
  let elm           = document.querySelector(options.el) //在Vue 中是字符串，这里是DOM
  this._template    = elm
  this._parentNode  = elm.parentNode  //父节点

  // 将 data 进行响应式转换，进行代理
  this.initData()

  // 挂载
  this.mount()

}