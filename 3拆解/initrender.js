AVue.prototype.mount = function () {
      
  // 需要提供一个 render 方法：生成 虚拟DOM 
  this.render = this.createRenderFn()

  this.mountComponent()
}
AVue.prototype.mountComponent = function (){
  //执行 mountComponent() 函数
  let mount = ()=>{
    // update就是将虚拟DOM渲染到页面上
    this.update(this.render())
  }
  // 本质上应该交给 watcher 来调用，但是这会还没讲
  // 发布订阅模式
  mount.call(this) 

  // 为什么
  // this.update(this.render())  //使用发布订阅模式，渲染和计算的行为应该交给watcher 来完成
}

/**
 * 在真正的Vue中使用了 二次提交的 设计结构
 * 1.在页面中的 DOM 和虚拟 DOM 是一一对应的关系
 * 2.先有AST 和 数据生成 新VNode（新，render）
 * 3.将 旧的VNode 和 新的VNode 比较（diff）,更新（update）
*/


// 这里是生成 render 函数 ，目的是缓存 抽象语法树(我们使用 虚拟DOM 来模拟)
AVue.prototype.createRenderFn = function(){
  // 缓存，
  let AST = generateVNode(this._template)
  
  
  //Vue：将AST + data => VNode
  // 我们：带有坑的VNode +data =>含有数据的VNode
  return function render (){
      return combine(AST,this._data)
  }
}

//将虚拟DOM渲染到页面中，diff算法就在这
AVue.prototype.update = function (vnode){
  // 简化，逐步逼近真实的vue实现
  // 直接生成 HTML DOM replaceChild到页面上
  console.log(this._parentNode);
  let realDOM = parseVNode(vnode)
  this._parentNode.replaceChild(realDOM,document.querySelector('#root'))
}

