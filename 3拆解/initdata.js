   /**
     * 数据响应式
    */
   let ARRAY_METHOD = [
    'push',
    'pop',
    'shift',
    'unshift',
    'unreverse',
    'sort',
    'splice'
]

// 思路：原型式继承：修改原型链的结构
// 继承关系 arr => Array.prototype => Object.prototype
// 继承关系 arr => 改写的方法 =>Array.prototype => Object.prototype
//Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
let array_methods = Object.create(Array.prototype)
ARRAY_METHOD.forEach(method=>{
  array_methods[method] = function () {
    
    // 将数据进行响应式化
    console.log('调用拦截的push方法');
    for(let i = 0 ; i<arguments.length;i++){
      reactify(arguments[i])  //这里还是无法传递vue实例，在引入watcher以后
    }
    // 调用原来的方法
    let len = Array.prototype[method].apply(this,arguments)
    return len
  }
})

   // vue里面简化后的版本
   function defineReactive(target,key,value,enumerable){
     let that = this
    if (typeof value ==="object" && value !=null ) {
      // 非数组引用类型
      observer(value,that)   //递归
    }
    // 闭包，形成局部作用域，value就在内部调用
    // Object.defineProperty
    Object.defineProperty(target,key,{
      configurable:true,
      enumerable:!!enumerable,
      get(){
        console.log(`读取 obj 的 ${key}属性值`);
        
        return value
      },
      set(newValue){
        console.log(`设置 obj 的 ${key}属性值为${newValue}`);
        // 当改变值的时候，就刷新（现在这种方式还不是Vue中的方式）
        // 要获取Vue实例如何获取啦

        /**目的
         * 将重新赋值的数据变成响应式的 ，因此如果传入的是对象类型，那么就需要使用 observer 将其转化为响应式
         * */ 
        if (typeof value ==="object" && value !== null) {
          observer(value,that)
        }
        value = newValue

        //模板刷新（这里现在是假 的，只是演示）
        // vue实例，watcher就不会有这个问题
        typeof that.mountComponent === 'function' && that.mountComponent()
        // 对数组的临时解决方案：数组现在没有参与页面的渲染，
        // 所以在数组上进行响应式的处理，不需要页面的刷新
        // 那么 即使 这里无法调用也没有关系
      }
    })
  }

  // 将对象响应式 vm就是vue实例，为了方便处理上下文
  function observer(obj,vm) {
    // 之前没有对 obj 本身进行操作，这一次直接对 obj 进行判断
    if (obj instanceof Array) {
      // 数组，对其每一个元素处理
      obj.__proto__ = array_methods
      for(let i = 0; i<obj.length ; i++){
        observer(obj[i],vm)
      }
    }else{
      // 对其成员进行处理
      let keys = Object.keys(obj)
      for(let i = 0; i < keys.length ; i++){
        let prop = keys[i] //属性名
        defineReactive.call(vm,obj,prop,obj[prop],true)
      }
    }
  }


  /*****************************************/
  // 取代原来的reactify 方法，将对象转换为 响应式
  // function observer( obj,propName ,vm) {
    // 在这里查看对象的成员，递归
    // 在这里调用 defineReactive 方法
  //   if (Array.isArray(obj[propName])) {
  //     let length = obj[]
  //   } else {
      
  //   }
  // }

  AVue.prototype.initData = function (){
    // 遍历 this._data 的成员，将属性转换为响应式（上），将直接属性，代理到实例上
    let  keys = Object.keys(this._data)
    // 响应式化
    for(let i = 0 ;i <keys.length ; i++){
      // 这里将 对象 this._data[keys[i]] 变成响应式的
      observer(this._data,this)
    }
    // 代理
    for(let i = 0 ; i < keys.length ; i++){
      // 这里将 this._data[keys[i]] 映射到 this[keys[i]] 上 
      // 就是要让this 提供 keys[i] 这个属性。在访问这个属性的时候 相当于在访问 this._data 这个属性
      proxy(this,'_data',keys[i])

    }
  }
  // 将 某一个对象的属性 访问 映射到 对象的某一个属性成员上
  function proxy(target,prop,key){
    Object.defineProperty(target,key,{
        enumerable:true,
        configurable:true,
        get(){
          return target[prop][key]
        },
        set(newValue){
          target[prop][key] = newValue
        }
      })
  }
