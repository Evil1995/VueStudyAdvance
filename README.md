# VueStudyAdvance
vue_study_advance

# vue源码解析

父子组件通信

* props:
* $emit

多层级组件通信

* 三层;this.$parent.emit
* 多层

```javascript
//向上通知自己的父辈：dispatch方法
Vue.prototype.$dispatch = function (eventName,value){
    //获取调用这个方法的父亲
    let parent = this.$parent
    while(parent){
        parent.$emit(eventName,value)
        parent = parent.$parent
    }
}
//向下通知子辈
Vue.prototype.
```



### 数据驱动

#### Vue和模板

使用步骤：

* 1.编写 页面 模板
  * 直接在Html标签中写
  * 使用template
  * 实用单文件 `<template/>`
* 2.创建 Vue 的实例
  * 在 Vue 的构造函数中提供：data,methods,watch,props,...
* 3.将Vue挂载 页面上 （mount）

### 虚拟DOM

如何将真正的DOM转换为虚拟DOM

怎么将虚拟DOM转换为 真正的DOM

思路和深拷贝类似

### 函数柯里化

柯里化：一个函数原本有多个参数，只传入**一个**参数生成一个新函数，由新函数接收剩下的参数来运行得到结构

偏函数：一个函数原本有多个参数，只传入**一部分**参数生成一个新函数，由新函数接收剩下的参数来运行得到结构

高阶函数：一个函数参数是一个函数，该函数对参数进行加工，得到一个函数，这个加工的函数就是高阶函数

为什么要使用柯里化？

* 为了提升性能，使用柯里化可以**缓存**一部分能力：消耗新能的部分缓存 起来

使用两个案例来说明

* 1.判断元素
  * Vue 本质上是使用 HTML 的字符串作为模板的，将 字符串 转换为AST , 再转换为VNode
  * 字符串 =》 AST  =》VNode =》DOM，其中最消耗性能是字符串=》AST(字符串解析)    
  * 例子：let s = "1 + 2 + ( 3 + 4 *( 5 + 6 ) )"写一个程序，解析得到表达式，得到结果（一般化）
    * 我们会将这个表达式转换为 “'逆波兰表达式'，然后使用栈结构来运算
  * 在VUE中每一个标签可以是真正的HTML标签，也可以是自定义组件，如何区分啦？（枚举）
  * VUE源码中其实将所有可能用到的HTML标签已经存起来了
* 虚拟DOM的 render 方法
  * 思考：vue项目  模板  转化为  抽象语法树  需要转换几次？
    * 页面一开始加载需要渲染
    * 每一个属性 （响应式）数据在发生变化的时候 要渲染
    * watch ， computed 。。。等等
    * 我们昨天写的代码 每次需要渲染的时候，模板就会被解析一次 （注意，我们简化了解析方法）
    * render 的作用就是 将虚拟DOM 转化为 DOM 加到页面中
    * 虚拟 DOM 可以降级理解为 AST
    * 一个项目运行的时候，模板是不会变的，就表示AST是不会变的
    * 我们可以将代码进行优化，将 虚拟DOM 缓存起来，生成一个函数，函数只需要传入数据，就可以得到  真正的DOM

### 响应式原理

我们在使用**Vue**的时候，赋值属性或者获得属性都是直接使用的 **vue**实例 

我们在设置属性值时，伴随着页面的数据更新

```javascript
//Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象
Object.defineProperty(对象，'设置的属性名'，{
writeable
configurable
enumerable：控制属性是否可枚举，是否可以被for-in取出来
set():赋值触发
get():取值触发
})


  // vue里面简化后的版本
    function defineReactive(target,key,value,enumerable){
      // 闭包，形成局部作用域，value就在内部调用
      Object.defineProperty(target,key,{
        configurable:true,
        enumerable:!!enumerable,
        get(){
          console.log(`读取 obj 的 ${key}属性值`);
          
          return value
        },
        set(newValue){
          console.log(`设置 obj 的 ${key}属性值为${newValue}`);
          value = newValue
        }
      })
    }

    // 将对象转为响应式的
    let keys = Object.keys(obj)
    for(let i = 0 ; i < keys.length ; i++){
      defineReactive(obj,keys[i],obj[keys[i]],true)
    }
```

实际开发中对象一般是有多级

```javascript
//eg:
let data = {
    list:[
        {}
    ],
    ads:[
        {}
    ],
    user:{
        
    }
}
//这种多层级的该如何处理啦？ ==》 递归
//对于对象可以使用 递归来实现响应式，但是数组我们也需要处理
-push
-pop
-shift
-unshift
-unreverse
-sort
-splice
//要做什么事情啦？
//1.在改变数组的时候要发出通知
	//-Vue 2 中的缺陷，数组发生变化，设置length没法通知（Vue 3 中使用Proxy 语法ES6的语法解决了这个问题）
//2.加入的元素应该变成响应式的
//技巧:如果一个函数已经定义了，但是我们需要扩展其功能，我们一般采用的方法
	//1.使用一个临时的函数名存储函数
	//2.重新定义原来的函数
	//3.定义扩展的功能
	//4.调用临时的那个函数
//扩展数组的push 和 pop 怎么处理啦？
	
	//直接修改 prototype 不行
	//修改要进行响应式的数组的原型（__proto__）
```

### 发布订阅者模式

- 代理方法（`app.name,app._data.name`）:现在我们访问name只能通过`app._data.name`的 方式访问，要将他变换为`app.name`也能访问
- 事件模型（node:event模块）
- Vue 中 Observe 与 Watcher 和 Dep

代理方法，就是要将`app._data`的成员 映射到 `app` 上

由于需要在更新数据的时候，更新页面的内容

所以 `app._data`访问的成员 与`app`访问的成员应该是同一个成员

由于`app._data`已经是响应式的对象了，所以只需要让app访问的成员去访问`app._data`的对应成员就可以了

引入一个函数 ES6Proxy(target,src,prop),将 target 的操作映射到src.prop上（target:对应`app`,src:对应`app._data`,prop:对应`name`）

我们之前处理的rectify 方法已经不行了，我们需要一个新的方法来处理

提供一个 Observer 的方法，在这个方法中对属性进行处理

可以将这个方法封装到 initData 方法中