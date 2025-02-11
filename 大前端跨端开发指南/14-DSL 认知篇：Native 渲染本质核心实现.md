## 一前言

上一章节中，介绍了 DSL 在 webview 中的应用—跨端 web 应用和小程序应用。本章节还是围绕着 DSL 展开，重点讲解一下 DSL 在 Native 渲染模式下的本质，然后在前端角度去模拟 Native 渲染的实现。

## 二 Native 渲染本质

**为什么要有 Native 渲染模式？**

移动端采用 webview 的渲染模式，固然灵活，可以实现动态化更新，而且没有 app 的版本控制，在 web h5 应用中，如果想要动态化发版，只需要重新部署前端应用就可以了；小程序发版也比较灵活，通过后台上传小程序包就可以了。

但是 webview 渲染模式的应用也有比较明显的缺陷：

* 第一个就是性能方面上不如原生 Native 应用，而且 Native 应用还有一些原生组件的支持，比如长列表组件 RecyclerView 等。
* 第二个就是 webview 应用没有 Native 应用直接调用设备的能力，如果想要实现，可能还需要与 Native 进行桥通信。

但是 Native 应用无法实现**动态化**，每次都需要重新发版本，并且还有包体积等因素限制。

所以在传统 web 应用和原生 Native 应用，需要一种中间态，既能够实现动态化发版本，也能解决性能等瓶颈，这个就是 **DSL Native 渲染模式**。

Native 渲染模式的前端框架，有 React 官方提供的 React Native，也有以 React 语法做 DSL 的框架 Rax, 再或者用 Vue 做 DSL 的 weex 。 这些跨端框架，也可以通过强大的**运行时**和**编译时**能力，在 web 应用和小程序应用中，实现相互转化，在动态化的基础上实现了**多端复用**。

**动态化**和**多端复用**也就成为这两年跨端发展的趋势。

**Native 渲染模式本质是什么？**

说到 Native 渲染模式，本质上就是用 JavaScript 作为逻辑层的处理，再用 Native 进行渲染的方式。也就是视图的描述和整体的逻辑交互都是在 JS 层面处理的。当 JS 处理完逻辑之后，会通知给 Native 去重新渲染视图。这样就保障了 Native 渲染的高性能。

同样实现动态化也非常容易，Native 渲染模式下，逻辑层就是 JS ,那么可以把对应的 JS 上传到云平台，然后 Native 动态向平台拉去最新的 JS 文件，这样就可以实现动态化的更新了。

**native 渲染模式下，前端充当的角色？**

在 Native 渲染模式下，无论是 Vue 还是 React 或者是小程序语法的 DSL 应用，最终在 JS 内存中会构建出一颗虚拟 DOM 树，虚拟 DOM 树直观描述了页面的视图结构，然后需要把这些视图结构的**绘制指令**，通过桥的方式传递到 Native 侧，Native 侧根据这些**绘制指令**渲染页面。

比如在视图层，页面结构长如下样子：

```html
<view name="A" >
    <view name="B" >
        <view name="D" ></view>
        <view name="E" ></view>
    </view>
    <view name="C" >
        <view name="F" ></view>
    </view>
</view>
```

那么在 JS 中生成的语法树结构如下所示：

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e16b13d16bfb4941ae98ba91553f9417~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1426&h=474&s=107498&e=png&b=ffffff)

当发生更新的时候，在 JS 端会进行 diff 对比，对比数据有没有发生变化，视图需不需要更新，如果视图需要更新，那么向 Native 发送对应的指令，让 Native 触发更新就可以了。这里描述几个简单指令：

* create 创建元素节点。
* update 更新元素节点。
* delete 删除元素节点。

![2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/83cdd890274b4a2a8a0fe7bd70aaf149~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1414&h=1382&s=185328&e=png&b=ffffff)

**DSL 解析流程**

接下来我们从**初始化**和**更新**两个角度，来看一下 Native 渲染模式 DSL 的整个流程。

DSL 应用初始化流程：

![3.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e543f5331c1b46f48451c17137464d61~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1312&h=1250&s=443001&e=png&b=ffffff)

* 编译时：在编译时，无论是基于 React 语法或者 Vue 语法，还是小程序语法，都会被编译成一个 JS 文件（也可以叫 JS bundle）, 然后可以通过构建工具把 JS bundle 上传到云平台上。

* 运行时：在运行时，Native 可以从远程平台上，拉取最新的 bundle JS 代码，实现了动态化，然后利用运行时的基础库形成视图对应结构的虚拟 DOM 树。然后根据虚拟 DOM 向 Native 发送绘制指令，最后由 Native 绘制页面。

DSL 应用事件交互，触发更新流程：

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/787b1e5141b94e76baa8fad4efbcf164~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1214&h=554&s=54361&e=png&b=ffffff)

* 当用户发生点击的时候，Native 触发点击的响应事件，接下来会把事件通信 JS 运行时，然后 JS 触发对应的响应事件，接下来发生更新，diff 对比虚拟 DOM , 形成新的虚拟 DOM ，接下来向 Native 重新发送渲染指令，然后更新视图，完成整个用户响应流程。

## 三 前端模拟 Native 渲染实现

接下来我们用一个非常简单案例，来用前端的方式模拟 DSL Native 渲染流程。

![5.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa82a307fc8f43b99401616ba8563feb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=570&h=128&s=14693&e=png&b=272829)

如上：

* index.html 为视图层, 这里用**视图层模拟代替了 Native 应用**。
* bridge 为 JS 层和 Native 层的代码。
* service.js 为我们写在 js 业务层的代码。

核心流程如下：

* 本质上 service.js 运行在 Native 的 JS 引擎中，形成虚拟 DOM ，和绘制指令。
* 绘制指令可以通过 bridge 传递给 Native 端 （案例中的 html 和 js ）,然后渲染视图。
* 当触发更新时候，Native 端响应事件，然后把事件通过桥方式传递给 service.js， 接下来 service.js 处理逻辑，发生 diff 更新，产生新的绘制指令，通知给 Native 渲染视图。

因为这个案例是用 web 应用模拟的 Native ,所以实现细节和真实场景有所不同，尽请谅解，本案例主要让读者更清晰了解渲染流程。

选 React 语法作为 DSL ，简单描述一下完整的流程。比如我们在 React DSL 应用中，写如下代码：

```js
class Home extends Component{
    state={
        show:true
    }
    handleClick(){
      this.setState({ show:false  })
    }
    render(){
        const { show } = this.state
        return <view style="height:400px;width:300px;border:1px solid #ccc;" >
                    <view style="height:100px;width:300px;background:blue"  >小册名：大前端跨端开发指南</view>
                    { show && <view style="height:100px;width:300px;background:pink" >作者：我不是外星人</view> }
                    <button onClick={handleClick} >删除作者</button>
        </view>
    }
}
```

这段代码描述了一个视图结构，有一个点击方法，当触发点击方法的时候，改变 show 状态，这个时候可以把 `<view>作者：我不是外星人</view>` 删除。

这段代码首先会被编译，jsx 语法变成 createNode 形式。如下：

```js
class Home extends Component{
    state={
        show:true
    }
    handleClick(){
      this.setState({ show:false  })
    }
    render(){
        const { show } = this.state
        return createNode('view',{ style:'height:400px;width:300px;border:1px solid #ccc;' }, [
            createNode('view',{ style:'height:100px;width:300px;background:blue' }, '小册名：大前端跨端开发指南'),
            show && createNode('view',{ style:'height:100px;width:300px;background:pink' }, '作者：我不是外星人'),
            createNode('button',{ onClick: this.handleClick }, '删除作者')
        ] )
    }
}
```

在 React 中，用 createElment 来描述视图结构，但是本次实现的是以 React 语法做 DSL 应用，本质上并不是 React，（语法一样，但是实现完全不同）所以这里我们直接用 createNode 来代替。createNode 实现非常简单如下：

```js
function createNode(tag,props,children){
    const node = {
        tag,
        props,
        children,
    }
    return node
}
```

createNode 会创建一个虚拟 DOM 节点，其中包括 tag，props 和 children 三个属性，这样视图结构就变成了如下的结构：

```js
{
  tag: 'view',
  props: { style },
  children: [
    {
      tag: 'view',
      props: { style },
      children: '小册名：大前端跨端开发指南',
    },
    {
      tag: 'view',
      props:{ style },
      children: '作者：我不是外星人',
    },
    {
      tag: 'button',
      props: { onClick },
      children: '删除作者',
    }
  ],
}
```

**初始化流程：**

在初始化的时候，Native 开始加载 JS bundle，加载完 JS bundle ，同时通过桥向 JS 通信，开始运行加载 service.js 。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root" ></div>
</body>
<script src="./bridge.js" ></script>
<script>
    /* 指令解析器 */
    function handleDirect(directList){
        //...
    }
    /* 监听 JS （service.js）向 Native (index.html,index.js) 通信 */
    window.port2.onmessage = function(event) {
        //...
    }
    /* 模拟加载 bundle 流程 */
    const script = document.createElement('script')
    script.src = './service.js'
    script.onload = function(){
        /* 初始化逻辑层 */
        NativeToJs({ type:'init' })
    }
    document.body.appendChild(script)
</script>
</html>
```

因为涉及到桥通信，我们这里用 postMessage 来模拟了**Native<->JS** 双向通信流程。代码如下：

```js
const { port1, port2 } = new MessageChannel();

window.port1 = port1
window.port2 = port2


/* JS 向 Native 通信 */
function JsToNative(payload){
    console.warn('JS -> Native ')
    port1.postMessage(payload)
}

/* Native 向 JS 通信 */
function NativeToJs(payload){
    console.warn('Native -> JS ')
    port2.postMessage(payload)
}

```

MessageChannel 会产生两个端口，port1 和 port2，可以通过两个端口的 postMessage 和 onmessage 方法来实现双向的通信。**注意：真实场景下，是通过 JSbridge 来实现的，在 React Native 通信章节，会介绍相关通信机制和背后运行的原理，这里只是用 MessageChannel 来模拟效果。**

如上在 bundle 加载之后，会调用 NativeToJs 方法来完成 JS 层的初始化流程。在 service.js 中，我们模拟一下对 Native 事件的监听。

```js

let workInProgress 
 /* 监听 Native (index.html) 向 JS （service.js） 通信 */
window.port1.onmessage = function(event){
    const { type,nodeId } = event.data
    /* 初始化逻辑层 */
    if(type === 'init'){
        workInProgress = renderInstance()
     /* 发生点击事件 */   
    }else if(type === 'click') {
        console.log(nodeId)
        const event = eventMap.get(nodeId)
        event && event.call(workInProgress)
    }
}
```

这里主要监听两种事件：

* 第一种就是 Native 通信 JS 层完成初始化，初始化完成，渲染视图。
* 第二种就是 Native 发生事件，触发 JS 对应的回调函数。

刚刚在模拟 bundle 初始化的过程中，最终调用的是 NativeToJs({ type:'init' }) 方法。那么就会走到 renderInstance 逻辑中。

```js
/* 应用初始化 */
function renderInstance(){
    /* 初始化-渲染形成元素节点 */
    const instance = new Home()
    const newVode = instance.render()
    instance.vnode = diff(newVode,null,'root')
    /* 发送绘制指令 */
    JsToNative({ type:'render' ,data: JSON.stringify(directList) })
    return instance
}
```

这个逻辑非常重要，主要可以分成三部分：

* 第一部分：就是实例化上面写的 Home 组件，然后调用 render 函数生成虚拟 DOM 结构。
* 第二部分: 调用 diff 来对比新老节点，如果初始化的时候，是没有老元素的，所以 diff 的第二个参数为 null。在 diff 期间，会收集各种渲染指令，**有了这些渲染指令，既可以在 Native 端渲染，也可以在 web 渲染，这样就可以轻松的实现跨端**。这里为了做新来元素的 diff ,通过 vnode 属性来保存了最新构建的虚拟 DOM 树。
* 第三部分：就是通过桥的方式，来把指令信息传递过去，在传递过程中，因为只能传递字符串，所以这里用 stringify 来序列化生成的指令。

来看一下核心 diff 的实现：

```js
let directList = []

const CREATE = 'CREATE'  /* 创建 */
const UPDATE = 'UPDATE'  /* 更新 */
const DELETE = 'DELETE'  /* 删除 */

let nodeId = -1
const eventMap = new Map()

function diffChild(newVNode,oldVNode,parentId){
    const newChildren = newVNode?.children
    const oldChildren = oldVNode?.children
    if(Array.isArray(newChildren)){
        newChildren.forEach((newChildrenNode,index)=>{
            const oldChildrenNode = oldChildren ? oldChildren[index] : null
            diff(newChildrenNode,oldChildrenNode,parentId)
        })
    }
}

/* 对比获取渲染指令 */
function diff(newVNode,oldVNode,parentId){
    /* 新增元素 */
    if(newVNode && !oldVNode){
        newVNode.nodeId = ++nodeId
        newVNode.parentId = parentId
        let content = ''
        /* 如果存在点击事件，那么映射dui */
        if(newVNode?.props?.onClick){
            const onClick = newVNode.props.onClick
            eventMap.set(nodeId,onClick)
            newVNode.props.onClick = onClick.name // handleClick
        }
        if(Array.isArray(newVNode.children)){
            diffChild(newVNode,null,nodeId)
        }else {
            content = newVNode.children
        }
        /* 创建渲染指令 */
        const direct = {
            type:CREATE,
            tag:newVNode.tag,
            parentId,
            nodeId:newVNode.nodeId,
            content,
            props:newVNode.props
        }
        directList.push(direct)
         /* 删除元素 */
    }else if(!newVNode && oldVNode) {
       /* 创建删除指令 */
       const direct = {
            type:DELETE,
            tag:oldVNode.tag,
            parentId,
            nodeId:oldVNode.nodeId,
       }
       directList.push(direct)
    }else {
        /* 更新元素 */
        newVNode.nodeId = oldVNode.nodeId
        newVNode.parentId = oldVNode.parentId
        /* 只有文本发生变化的时候，才算元素发生了更新 */
        if(typeof newVNode.children === 'string' && newVNode.children !== oldVNode.children){
            /* 创建更新指令 */
            const direct = {
                type:UPDATE,
                parentId,
                nodeId:oldVNode.nodeId,
                content: newVNode.children,
                props:newVNode.props
           }
           directList.push(direct)
        }else{
            diffChild(newVNode,oldVNode,newVNode.nodeId)
        }
        
    }
    return newVNode
}
```

如上就是整个 diff 流程，在 diff 过程中，会判断新老节点，来收集不同的指令，在 React 是通过 render 阶段，来给 fiber 打不同的 flag 。

* 在 diff 过程中，会通过 nodeId 和 parentId 来记录当前元素节点的唯一性和当前元素的父元素是哪个。
* **如果有新元素，没有老元素，那么证明元素创建**，会收集 create 指令，在这期间会特殊处理一下函数，把函数通过 eventMap 来保存。
* **如果没有新元素，只有老元素，证明元素是删除**，会收集 delete 指令，让 Native 去删除元素。
* **如果新老元素都存在，那么证明有可能发生了更新**，这里做了偷懒，判定只有文本内容更新的时候，才触发更新.
* 接下就通过 diffChild 来递归元素节点，完成整个 DOM 树的遍历。

如果 `Home` 组件经过如上流程之后，会产生如下的绘制指令：

![6.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c94c037575f4d75bf776a165ab6665d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1104&h=1124&s=402754&e=png&b=202124)

有了这些指令之后，接下来就会把消息传递给 Native 端（index.html）,那么 Native 端同样要监听来自 JS 端的消息。

```js
/* 监听 JS （service.js）向 Native (index.html) 通信 */
window.port2.onmessage = function(event) {
    const { type,data } = event.data
    if(type === 'render'){
        const directList = JSON.parse(data)
        /* 处理绘制指令 */
        handleDirect(directList)
    }
}
```

如上当接受到渲染指令 render 的时候，会调用 handleDirect 来完成页面的绘制。

```js
function handleDirect(directList){
    console.log(directList)
    directList.sort((a,b)=> a.nodeId - b.nodeId ).forEach(item=>{
        const { content , nodeId, parentId, props, type, tag } = item
        /* 插入节点  */
        if(type ==='CREATE'){
            let curtag = 'div'
            switch(tag){
                case 'view':
                curtag = 'div'
                break
                default:
                curtag = tag
                break  
            }
            const node = document.createElement(curtag)
            node.id = 'node' + nodeId
            if(content) node.innerText = content
            /* 处理点击事件 */
            if(props.style) node.style = props.style
            if(props.onClick) {
            node.onclick = function(){
                /* 向 js 层发送事件 */
                NativeToJs({ type:'click', nodeId })
            }
            }
            if(parentId === 'root'){
                const root = document.getElementById('root')
                root.appendChild(node)
            }else{
                const parentNode = document.getElementById('node'+ parentId)
                parentNode && parentNode.appendChild(node)
            }
        }else if(type === 'DELETE'){
            /* 删除节点 */
            const parentNode = document.getElementById('node'+ parentId)
            const node = document.getElementById('node'+ nodeId)
            parentNode.removeChild(node)
        }
    })
}
```

这里用前端的方式，来模拟了整个绘制流程，具体内容包括：事件的处理，元素的处理，属性的处理等等。

其中有一个细节，就是如果发现指令中有绑定事件的时候，就会给元素绑定一个事件函数，当发生点击的时候，触发函数，向 JS 层发送信息。

来看一下最终样子。

![7.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49cba803777e4840bd2f212ff135a8db~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=3014&h=1542&s=177625&e=png&b=212225)

可以看到 Native -> JS , JS -> Native 两次通信，完成了初始化流程，视图也渲染了。接下来就是发生点击触发更新的流程。

**更新流程**

触发点击事件，Native 首先响应，然后向 JS 层发送事件，通过传递 NodeId:

```js
 /* 向 js 层发送事件 */
NativeToJs({ type:'click', nodeId })
```

JS 层接受到事件，执行对应的事件：

```js
else if(type === 'click') {
    const event = eventMap.get(nodeId)
    event && event.call(workInProgress)
}
```

JS 可以通过唯一标志 nodeId 来找到对应的函数，然后执行函数，在函数中会触发 setState, 改变 show 的状态，然后让 view 卸载：

```js
handleClick(){
    this.setState({ show:false  })
}
```

因为我们写的是 DSL ，并非真正的 React ，所以对于 Component 和 setStata 需要手动去实现，原理如下：

```js
/* Component 构造函数 */
function Component (){
    this.setState = setState
}
/* 触发更新 */
function setState (state){
    /* 合并 state */
    Object.assign(this.state,state)
    directList = []
    const newVode = this.render()
    this.vnode = diff(newVode,this.vnode,'root')
    /* 发送绘制指令 */
    JsToNative({ type:'render' ,data: JSON.stringify(directList) })
}
```

Component 很简单，就是给实例上绑定 this.setState 方法。handleClick 中会触发 setState 方法，其内部会合并 state ，然后重制指令，接下来重新调用 render 形成新 node, 和老 node 进行对比，对比哪些发生变化，会重新生成绘制指令。

当触发 show = false 时候，会触发 delete 指令，销毁元素。指令如下：

![8.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c31523f35a1418c9520306ace89ef4c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=3024&h=1726&s=288584&e=png&b=222326)

整体流程如下：

![9.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/540ec3c686cf41ef813322e40a6aef92~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=660&h=406&s=140820&e=gif&f=31&b=1e2021)

## 四 总结

本章节介绍 Native 渲染模式下 DSL 本质，本质上来看 Native 渲染模式还是很容易理解的， 对跨端感兴趣的同学可以串联上一节和本章节的内容。