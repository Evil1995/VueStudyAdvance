    /**
     * 虚拟DOM
    */
   class VNode{
    // tag:标签， data:标签属性，value:文本值， type:标签类型
    constructor(tag,data,value,type){
      this.tag      = tag && tag.toLowerCase()
      this.data     = data
      this.value    = value
      this.type     = type
      this.children = []
    }

    // 追加子节点
    appendChild(vnode){
      this.children.push(vnode)
    }
  }