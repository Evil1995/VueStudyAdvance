    /**
     * 有HTML DOM  ===》 VNode ：将这个函数当做compiler 函数
    */
   function generateVNode(node) {
    let nodeType = node.nodeType;
    let _vnode = null
    // 根据nodeType判断节点类型
    if (nodeType === 1) {
      //元素节点
      let nodeName = node.nodeName
      // 获取属性，是一个类数组
      let attrs = node.attributes
      let _attrsObj = {}
      for(let i = 0 ; i < attrs.length ; i++){ 
        // attrs[i] 属性节点(nodeType === 2)
        _attrsObj[attrs[i].nodeName] = attrs[i].nodeValue
      }
      _vnode = new VNode(nodeName,_attrsObj,undefined,nodeType)

      //考虑 node 的子元素(巧妙)
      let childNodes = node.childNodes
      for(let i = 0 ; i < childNodes.length ; i++){
        // 递归将子节点添加到_vnode上
        _vnode.appendChild(generateVNode(childNodes[i]))
      } 

    }else if (nodeType === 3) {
      // 文本节点
      _vnode = new VNode(undefined,undefined,node.nodeValue,nodeType)
    }

    // 返回虚拟DOM
    return _vnode
  }

   // 将vNode 转换为真正的DOM 老师版
   function parseVNode(vnode) {
    let type = vnode.type
    let _node = null
    if (type === 3) {
      return document.createTextNode(vnode.value)
    }else if (type === 1) {
      _node = document.createElement(vnode.tag)

      // 属性
      let data = vnode.data
      Object.keys(data).forEach(key=>{
        let attrName = key
        let attrValue = data[ key ]
        _node.setAttribute(attrName,attrValue)
      })

      // 子节点
      let children = vnode.children
      children.forEach(childVNode=>{
        _node.appendChild(parseVNode(childVNode)) //递归
      })

      return _node
    }
  }


  // {{}}正则表达式
  let reg = /\{\{(.+?)\}\}/g

  // 我们要解决什么问题啦？多层级
      // 使用 'xxx.yyy.zzz' 可以来访问某个对象
      // 就是用字符串路径来访问对象成员
      function getValueByPath(obj,path) {
        let paths = path.split('.') //[xxx,yyy,zzz]
        // 先取obj.xxx,再取结果中的yyy,再取得结果中的zzz
        let res = obj
        let prop
        while (prop = paths.shift()) {
          res = res[prop]
        }
        return  res
      }

  /**
   * 将带有坑的VNode 与数据结合，得到 填充数据的 VNode：模拟AST => VNode
  */    
  function combine(vnode,data) {
    let _type = vnode.type
    let _data = vnode.data
    let _value = vnode.value
    let _tag  = vnode.tag
    let _children = vnode.children

    let _vnode = null 
    if (_type === 1) {
      // 元素节点
      _vnode = new VNode(_tag,_data,_value,_type)
      _children.forEach(subVNode => _vnode.appendChild(combine(subVNode,data)));

    }else if (_type === 3) {
      // 文本节点
      // 对文本处理
      _value = _value.replace(reg,function (_,g) {
        return getValueByPath(data,g.trim())
      })
      _vnode = new VNode(_tag,_data,_value,_type)
    }
    

    return _vnode
  }
