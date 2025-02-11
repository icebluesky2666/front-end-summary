## 一 前言

在上一章节中，我们介绍了 Taro 的应用实战，本章节我们将继续围绕 Taro 介绍一下跨端实现原理。

我们选的是以 React 语法作 DSL 构建的微信小程序应用，串联第 29 节的内容，理由如下：

* 理解编译时，React 语法如何变成小程序应用，了解 JSX 是怎么映射到 wxml 的。
* 理解运行时，深入 Taro 是怎么保持 React 运行时的活性的。

通过本章节的学习，希望大家能够掌握 React Taro 的运行奥秘。在正式讲解之前，来聊一下 Taro 框架的演进过程。

在 Taro2.0 版本之前，Taro 才用了重编译时和轻运行时的思想，在老的版本中，还是以 Taro 小程序为切入点，对于大部分工作是靠编译来完成的。我们可以通过一篇文章[为何我们要用 React 来写小程序 - Taro 诞生记](https://juejin.cn/post/6844903624938635272?searchId=202311121003064FE485705368EF5CE51E "https://juejin.cn/post/6844903624938635272?searchId=202311121003064FE485705368EF5CE51E") 来了解一下 Taro 的前世今生。在老版本中，元素并不是通过虚拟 DOM 产生的，而是通过 JSX 向 wxml 的语法映射。比如说我们在 Taro 中写下如下代码：

```js
<View className='index'>
  <Button className='add_btn' onClick={this.props.add}>+</Button>
  <Button className='dec_btn' onClick={this.props.dec}>-</Button>
  <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
  <View>{this.props.counter.num}</View>
  <A />
  <Button onClick={this.goto}>走你</Button>
  <Image src={sd} />
</View>
```

最终在微信小程序端转化的产物，如下：

```js
<import src="../../components/A/A.wxml" />
<block>
  <view class="index">
    <button class="add_btn" bindtap="add">+</button>
    <button class="dec_btn" bindtap="dec">-</button>
    <button class="dec_btn" bindtap="asyncAdd">async</button>
    <view>{{counter.num}}</view>
    <template is="A" data="{{...?A}}"></template>
    <button bindtap="goto">走你</button>
    <image src="{{sd}}" />
  </view>
</block>
```

可以看到这就是 Taro 2.0 完成的核心流程。通过不同端的语法树，就可以将 Taro 代码映射成不同平台上对应的代码。

这种思想在 Taro3.0 中，有了本质上的变化，Taro3.0 围绕着轻编译重运行时的思想，这种思想保留了原生框架虚拟 DOM 的活性，也就是说虚拟 DOM 是直接转化成真实 DOM 树结构，并用这个 DOM 树结构来渲染。 比如我们在 Taro 应用中这么写：

```js
import { View, Text } from '@tarojs/components'
export default function Test(){
    return <View> 
          <View>大前端跨端开发指南</View>
          <Text>我不是外星人</Text>
    </View>
}
```

那么在 Taro 小程序中，最后会变成这个样子：

```js
function Test() {
    return (0, l.jsxs)(s.G7, {
        children: [(0, l.jsx)(s.G7, {
        children: "大前端跨端开发指南"
        }), (0, l.jsx)(s.xv, {
        children: "我不是外星人"
        })]
    })
}
```

如上 Taro 的组件，最终会被类似 React Element 包装一层，然后会运行在小程序的运行时，动态形成 wxml 结构。至于怎么动态生成 wxml 的，后面我们会讲到。

当然在 Taro 演进过程中，不只是视图层的变化，还有一些其他方面的优化。接下来从运行时和编译时两个角度介绍 Taro3.0 运行时原理。

## 二 Taro 编译时处理

**Taro React 编译成微信小程序**

Taro React 应用经过 `npm run build:weapp` 或者 `npm run dev:weapp` 命令之后，打包后产物会在 dist 文件下面找到，如下所示：

Taro 应用：
![3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e9e6c09af624d5592215758e172ead0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=482&h=666&s=144342&e=png&b=252526)

打包后 dist 目录如下所示：
![4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e1b2e787cbc4c03b4e48f50b349fbcc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=458&h=790&s=74173&e=png&b=262627)

每一个文件含义如下：

```js
-pages       
-prebundle  
-app.js
-app.json
-app.wxml
-comp.js
-comp.wxml
-comp.json
-runtime.js
-runtime.js.map
-taro.js
-taro.js.map
```

* pages :存放小程序页面，和 Taro 应用中 app.config.ts 里面声明的 pages 数组对应。
* prebundle: 里面存放 React react-dom 适配层等相关提供运行时的能力的文件。
* app.json app.js 等文件不用说。
* comp.js comp.wxml 动态模版。 比较重要，是 Taro 在运行时构建小程序的关键，能够通过递归还原 wxml 结构。
* runtime.js 和 taro.js 是 taro 提供基础能力的文件。

那么接下来以一个页面为例子，看一下 Taro 会编译成什么样子，比如在 Taro 的 Index 页面中这么写：

```js
import { Component, PropsWithChildren } from 'react'
import { View, Text } from '@tarojs/components'
import Test from '../../component/text'

import './index.scss'

class Index extends Component<PropsWithChildren> {
  state={
    number:1
  }
  /* 生命周期 */
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }
  /* 处理点击 */
  handleClick=()=>{
    this.setState({
       number: this.state.number + 1
    })
  }
  render () {
    const { number } = this.state
    return (
      <View className='index'>
          <Test />
          <View onClick={this.handleClick} >点击</View>
          <Text>{number}</Text>
      </View>
    )
  }
}
export default Index
// Test 文件如下：
import { View, Text } from '@tarojs/components'
export default function Test() {
    return <View>
        <View>大前端跨端开发指南</View>
        <Text>我不是外星人</Text>
    </View>
}
```

如上就是 Taro 构建的一个 Index 页面，那么接下来会被 Taro 编译成类似如下的样子：

```js
// 一些基础库的引入处理
// 一些基础方法 createSuper createJsxs createJsx

// test 组件的引入
function Test() {
    return createJsxs(taroComponent.view, {
        children: [ createJsx(taroComponent.view, {
        children: "大前端跨端开发指南"
        }), createJsx(taroComponent.text, {
        children: "我不是外星人"
        })]
    })
}

function Index(){
    // 处理一些继承逻辑，继承 Component
    const _super = createSuper() // 获取父元素构建函数
    function Index() {
        // 执行构造函数，创建 this 对象
        _this = _super.apply(_super, [this].concat(args));
        // 处理 state
        thisInitialized("state",{
            number: 1
        })
        // 处理事件
        thisInitialized("handleClick",function () {  
            _this.setState({
                number: _this.state.number + 1
            });
        },_this)
    }
    createClass(Index,[
        {
            key: "componentDidMount",
            value: function componentDidMount() {}
        }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {}
        }, {
            key: "componentDidShow",
            value: function componentDidShow() {}
        }, {
            key: "componentDidHide",
            value: function componentDidHide() {}
        },
        {
            key: "render",
            value:function render() {
                var number = this.state.number;
                return createJsxs(taroComponent.view, {
                          className: "index",
                          children: [
                            createJsx(Test, {}), 
                            createJsx(taroComponent.view, {
                               onClick: this.handleClick,
                               children: "点击"
                            }),  
                            createJsx(taroComponent.text, {children: number})]
        });
            }
        }
    ])
}
/* 生成小程序的 config 兑现 */
const config = createPageConfig(Index)
Page(config)
```

如上模版是为了我让大家更了解结构，简化成大致的结构（真实情况更加繁琐）：

* 在编辑阶段，会把类组件的生命周期，以及 render 函数。
* 对于 JSX 结构，会被编译成 createJsxs createJsx （这几个方法是我取得名字，代码里不是这个方法）。这个就类似于 React.createElement。
* 含有一些初始化方法，比如 state 的初始化，已经事件函数的处理。
* 还有一个细节需要注意，我们在业务中用是 React.Component, 但是在编译阶段，已经被 Taro 替换成 taroComponent 。

最终 createPageConfig 将页面对应的逻辑层 Index 传入进去，最终形成小程序对应的 config 对象，传递给页面构造器 Page。

在这个过程中，**把 Taro React 变成后的产物，首先将 Taro 运行时能力，和页面逻辑建立起关联。然后在通过 createPageConfig 将页面逻辑生成对应的 config。** 就这样一个小程序页面就完成了。

**动态组件模版：**

从上面我们知道了，Taro React 大部分的处理逻辑都变成了 JS 层逻辑，那么对应的小程序的 wxml 结构是什么样的呢？来看一下 Index 页面对应的 wxml。

wxml 文件：

```html
<import src="../../base.wxml"/>
<template is="taro_tmpl" data="{{root:root}}" />
```

json 文件：

```json
{
  "navigationBarTitleText": "首页",
  "usingComponents": {
    "comp": "../../comp"
  }
}
```

看到这里，有些读者可能比较疑惑？ 正常小程序视图层结构都是比较多且复杂的。为什么 Taro 小程序这么简单呢？答案就是**Taro 采用了动态模版的方案**， 动态模版方案在**第29章**已经讲到了，本质上就是没有 wxml 结构，而页面结构是通过页面数据，以及动态化组件递归实现的。

而 Taro 的动态化 wxml 就是通过递归组件 comp 和模版 base.wxml 实现的。来看一下 comp 组件。

```html
<import src="./base.wxml" />
<wxs module="xs" src="./utils.wxs" />
<template is="{{'tmpl_0_' + i.nn}}" data="{{i:i,c:1,l:xs.f('',i.nn)}}" />
```

```json
{
    "component":true,
    "usingComponents":{
        "comp":"./comp"
    }
}
```

再来看一下 base.wxml 模版代码：

```js
<template name="taro_tmpl">
  <block wx:for="{{root.cn}}" wx:key="sid">
    <template is="{{xs.a(0, item.nn, '')}}" data="{{i:item,c:1,l:xs.f('',item.nn)}}" />
  </block>
</template>

<template name="tmpl_0_0">
  <view hover-class="{{xs.b(i.p1,'none')}}" hover-stop-propagation="{{xs.b(i.p4,!1)}}" hover-start-time="{{xs.b(i.p2,50)}}" hover-stay-time="{{xs.b(i.p3,400)}}" bindtouchstart="eh" bindtouchend="eh" bindtouchcancel="eh" bindlongpress="eh" animation="{{i.p0}}" bindanimationstart="eh" bindanimationiteration="eh" bindanimationend="eh" bindtransitionend="eh" style="{{i.st}}" class="{{i.cl}}" bindtap="eh" catchtouchmove="eh"  id="{{i.uid||i.sid}}" data-sid="{{i.sid}}">
    <block wx:for="{{i.cn}}" wx:key="sid">
      <template is="{{xs.a(c, item.nn, l)}}" data="{{i:item,c:c+1,l:xs.f(l,item.nn)}}" />
    </block>
  </view>
</template>

<template name="tmpl_0_5">
  <view hover-class="{{xs.b(i.p1,'none')}}" hover-stop-propagation="{{xs.b(i.p4,!1)}}" hover-start-time="{{xs.b(i.p2,50)}}" hover-stay-time="{{xs.b(i.p3,400)}}" animation="{{i.p0}}" style="{{i.st}}" class="{{i.cl}}"  id="{{i.uid||i.sid}}" data-sid="{{i.sid}}">
    <block wx:for="{{i.cn}}" wx:key="sid">
      <template is="{{xs.a(c, item.nn, l)}}" data="{{i:item,c:c+1,l:xs.f(l,item.nn)}}" />
    </block>
  </view>
</template>
//....
// 递归渲染 comp
<template name="tmpl_15_container">
  <block wx:if="{{i.nn === '8'}}">
    <template is="tmpl_0_8" data="{{i:i}}" />
  </block>
  <block wx:else>
    <comp i="{{i}}" l="{{l}}" />
  </block>
</template>
```

如上就是 comp 代码和 base.wxml 的核心流程。核心流程如下：

* 在 comp 中递归调用自己，然后会根据不同的模版类型，渲染不同的模版。
* 在 base.wxml 中存在各个层级的模版，通过条件渲染不同的模版，完成这个 wxml 的渲染，如果模版层级不够，最终会选择递归 comp 。 通过这个操作，**只要渲染的 data 满足递归模版的渲染结构，就能渲染任何的页面。**

**编译入口**

知道了动态模版的原理，那么整个 Taro 小程序是这么生成的呢。首先当我们终端运行 npm run dev:weapp 或者 npm run build:weapp 之后，会执行对应的 node 文件，然后会将我们写的业务代码通过 babel 转化成目标代码。其核心代码流程如下：

```js
export default function transform(options){
    /* 解析源文件，生成对应的 ast */
    const ast = parseCode(code)
    /* 遍历 ast 通过不同文件的插件，对 ast 进行增删改查 */
    traverse(ast)
    /* 生成对应的文件 */
    const code = generate(ast.program as any).code
    return code
}
```

当然上面只是核心流程的伪代码，大体分为几个步骤：

* 第一步通过 parseCode 来解析 Taro 的业务代码，生成 ast 抽象语法树。
* 第二步通过 traverse 遍历不同的文件，并通过不同的文件插件，对 ast 进行增删改查。
* 最后一步，通过 generate 生成小程序对应的文件，比如 wxml 文件，js 文件，wxss 文件等。

对于里面的具体实现细节，就不过多介绍了。

## 三 Taro 运行时适配

讲完 Taro 编译时，接下来我们看一下 Taro 运行时的适配。我们还是从**初始化**和**更新**两个角度来分析。

### 3.1 初始化流程

通过如上编译时，我们知道了在编译阶段，最终会通过 createPageConfig 生成 config ，那么 Page 生成的 config 是什么样子的呢？我们来看一下:

![7.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c985f5f578e04c668bc4bc274b51fcc4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1558&h=1190&s=326474&e=png&b=262a34)

这样小程序的 config 层，就和 Taro React 的组件实例结合了。如上：

* Index 外层保存了 React Taro 页面对应的实例。里面包括 props， ref ，state 等属性。
* \_reactInternals 里面保存了对应的 fiber 对象。
* 还有就是 React 生命周期等信息。

这里有一个细节需要注意，那就是在页面 Page 初始化之前，已经完成了 Taro React 的初始化，包括虚拟 DOM 树基本已经构建完毕。\_reactInternals 对象已经生成，接下来就走小程序的初始化流程了。在讲初始化流程之前，看一下 createPageConfig 到底做了些什么。

**createPageConfig 到底做什么？**

```js
export function createPageConfig (component) {
    /* 配置路由信息 */
    function setCurrentRouter(){}
    /* 小程序真正的 config 对象 */
    const config = {
        /* onload 生命周期 */
        [ONLOAD] () {
            /* 设置路由信息 */
            setCurrentRouter(this)
            const mount = () => {
                Current.app!.mount!(component, $taroPath, () => {
                pageElement = env.document.getElementById<TaroRootElement>($taroPath)
                /* 执行 taro onLoad 生命周期 */
                safeExecute($taroPath, ON_LOAD, this.$taroParams)
                loadResolver()
                /* 触发页面更新 */
                pageElement.performUpdate(true, cb)
                })
            }
            /* 挂载真正的组件 */
            mount()
        },
    }
}
```

这里简化了流程，在 createPageConfig 中，会做一些初始化的动作，然后返回小程序真正的 config 对象。在 config 对象中，包含小程序的 onLoad 生命周期，接下来就走到了小程序的基础库，会执行 onLoad。在 onLoad 会执行初始化的 mount 函数。

在 mount 函数中，重点是 pageElement.performUpdate 方法，那么这个方法是怎么来的呢？里面又做了些什么呢？接着往下看：

**Taro Element元素**

知道 React 的同学 应该了解过，在 React 中有不同元素类型，比如整个虚拟 DOM 树的根元素 root 类型, 比如 div, test 标签元素的 hostComponent 类型。

在 Taro 中也有不同的元素的类型，像上面说到的 TaroRootElement , TaroText ，TaroElement。 其中 TaroRootElement 上保存了更新小程序视图的方法。来看一下：

```js
class TaroRootElement extends TaroElement {
    /* 更新主要方法 */
    public performUpdate (initRender = false, prerender?: Func) {
    this.pendingUpdate = true
    /* 找到 */
    const ctx = hooks.call('proxyToRaw', this.ctx)!

    setTimeout(() => {
      if (initRender) {
        // 初次渲染，使用页面级别的 setData
        normalUpdate = data
      } else {
        // 更新渲染，区分 CustomWrapper 与页面级别的 setData
        
      }

      // 页面维度渲染
      if (isNeedNormalUpdate) {
        ctx.setData(normalUpdate, cb)
      }
    }, 0)
  }
}
```

如上就是 TaroRootElement 的内部实现，这里只保留了部分代码片段。里面重点介绍两个方法 `enqueueUpdate` 和 `performUpdate`。

* enqueueUpdate 是 Taro React 触发 setState 或者 useState 完成虚拟 DOM 构建之后，触发更新的方法。
* performUpdate 是整个更新的入口。负责整个页面或者组件更新。

**异步触发 setData**

在调用 performUpdate 的时候，会判断是否是第一次渲染，接下来直接调用小程序的 setData 进行渲染。来看一下渲染数据源结构。

**渲染视图结构**

如上当完成初始化或者发生更新的时候，会产生的 this.data.root , 这个数据反映了整个小程序的视图结构，也是虚拟 DOM 映射出的产物。

![5.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23a1045589944533bb3fab677a635c3d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=994&h=1258&s=389433&e=png&b=272b35)

如上就是待渲染的最终产物，这个数据结构与递归模版组件适配，接下来就是循环渲染与递归渲染还原整个视图结构了，最终完成页面渲染。

**回顾整个流程：**

* 第一阶段虚拟 DOM 构建阶段：当小程序打开一个新的页面时候，首先会执行页面对应的 js 文件，在 js 文件中，会根据编译阶段的 JSX 结构，进行 React 运行时的初始化动作，接下来会走 React 调和流程，最终生成一个视图渲染产物（如上的 this.data.root）。

* 第二阶段小程序初始化阶段：接下来通过 createPageConfig 生成页面的 config 文件，里面包括了 React 虚拟 DOM 树和视图渲染产物，接下来进入小程序流程，小程序会执行 onLoad 函数，在 onLoad 函数内部，会执行 mount 初始化更新流程，最终走到了 TaroRootElement 元素的 performUpdate 方法。在这个方法内部，通过 setTimeout 异步调用小程序的 setData 方法。

* 第三阶段视图渲染阶段：触发 setData 之后，渲染产物，会通过循环遍历以及递归调用的方式，渲染整个页面，还原视图结构。

![8.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9a83417d8824a0c863b27ea6cd8e2d5~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2026&h=1354&s=200400&e=png&b=ffffff)

### 3.2 更新流程

更新流程和初始化流程差不多。首先就是触发了 React Taro 的 setState 或者 useState 方法，在方法内部，会通过 React 运行时的 render 和 commit 阶段，重新生成虚拟 DOM 树，进而改变渲染视图的产物 this.data.root 。接下来会调用 TaroRootElement 下面的 enqueueUpdate 方法。

```js
public enqueueUpdate (payload: UpdatePayload): void {
    this.updatePayloads.push(payload)

    if (!this.pendingUpdate && this.ctx) {
        this.performUpdate()
    }
} 
```

enqueueUpdate 内部最终也是调用的是 performUpdate。在 enqueueUpdate 内部在异步调用 setData ，重新渲染视图。这里有一点需要注意的事。Taro React 的 setState 对于执行上下文是同步执行的，但是最后**会 setTimeout 异步调用 setData**。

![9.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa3b65c9481d4beda9884696e951dc27~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1588&h=982&s=125698&e=png&b=ffffff)

## 四 总结

如上，通过运行时和编译时两个角度。探索了 Taro 底层的奥秘，感兴趣的读者可以下载 github 上的[源码](https://github.com/NervJS/taro "https://github.com/NervJS/taro")，亲自看一下里面是如何实现的。相信会有更大的收获。

### 参考文章

* [为何我们要用 React 来写小程序 - Taro 诞生记](https://juejin.cn/post/6844903624938635272?searchId=202311121003064FE485705368EF5CE51E "https://juejin.cn/post/6844903624938635272?searchId=202311121003064FE485705368EF5CE51E")