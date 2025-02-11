## 一 前言

上两个章节介绍了小程序设计模式的实践部分，小程序章节也就迎来了完结，本章节开始将讲解新的内容。本节将重点介绍在移动端领域 DSL 的应用。

## 二 DSL 介绍

**DSL 在前端的应用：**

领域特定语言（英语：domain-specific language）简称 DSL，比如 SQL , JSON 等。

DSL 分为内部 DSL 和外部 DSL 。

* 使用独立的解释器或编译器实现的 DSL 被称为外部 DSL。 外部 DSL 的优点在于它是独立于程序开发语言的。对某个特定领域进行操作的程序不一定是使用同一种语言来写的。SQL 就是一种 DSL，学会了 SQL 就可以在不同的语言中使用相同的 SQL 来操作数据库。

* 内部 DSL。（则是在一个宿主语言（host language）中实现，它一般以库的形式实现，并倾向于使用宿主语言中的语法。内部 DSL 的优点和缺点与外部 DSL 相反，它借助了宿主语言的语法，程序员无需学习一种新的语言。但是它被限制在宿主语言能够描述的范围内，因此自由度较低。

在前端领域上，DSL 也有广泛的应用，更多的是以 JavaScript 作为基础语言的内部 DSL 。目前主流的框架 Vue 和 React 都和 DSL 有着千丝万缕的关系。

* 比如 React 中表现层 JSX 语法的设计与 DSL 是分不开的。JSX 能够形象的表示出视图层的结构， 但在 JS 中本来是不支持 JSX 语法的，这就需要 babel 等转译工具链支持。

```js
function Head (){
    return <div>
    </div>
}
```

* 在 Vue 中也有应用 DSL 的场景，Vue 中，为了方便开发者使用 Vue，在 Vue 中引入了全新的 `.vue` 文件，在这个文件中，template 就是对应描述 html 内容的, script 对应的是传统 html 文件中的 js 代码，style 对应的是传统 html 文件中的 css 样式，如下所示：

```html
<template>
    <div>Hello World</div>
</template>
<script>
    // 这里写 JS    
</script>
<style></style>
```

* 小程序的设计也离不开 DSL ，比如 wxml, wxss ，wxs 本质上属于小程序定制的 DSL，开发者可以按照定制的 DSL 约定在 JS 环境下完成小程序应用的开发。

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5489c05c90048dda8836ab94ccb0dd3~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=446&h=222&s=20582&e=png&b=252526)

Vue ，React, 微信小程序作为前端开发必备的三件套技能，在前端开发市场上，占有了极大的份额。

**跨端 DSL：**

回到前端跨端领域，在这个领域上，DSL 的应用可以说是在原来的基础上的升级。目前也衍生了很多跨端框架，比如 Taro、weex 、uni-app 、mpvue 、remax ,这些框架有一个共性就是：先以 JavaScript 作为基础选定一个 DSL 框架，以这个 DSL 框架为标准在各端分别编译为不同的代码，各端分别有一个运行时框架或兼容组件库保证代码正确运行。

这些框架都是以 Vue 或者 React ，小程序等前端基础框架语法作为 DSL ,可以实现一套代码运行 web 端，移动小程序端，甚至是 Native 应用。

其中 babel 在其中充当的角色十分重要，通过 babel 工具链可以实现不同应用代码的相互转换。

比如：

* 基于 React 语法的 Taro ，可以转换成微信小程序或者 web 应用，RN 应用。
* 微信小程序也可以通过相关能力，变成 web 应用或者是 Native 应用。

那么这些 DSL 跨端本质是什么？ 又是如何实现的相互转换的呢？跟上思路我们往下看。

## 三 webview 渲染模式下 DSL 本质

在讲跨端之前，先来看看主流的 Vue 和 React 框架的运行本质。

**React 框架本质**

![2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8cb81424824447d09dab73452704dc1d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1408&h=1108&s=139457&e=png&b=ffffff)

编译时：我们描述一下整个流程，首先通过 React cli 可以是 `react-create-app`，来编译解析 jsx ，scss/less 等文件，jsx 语法会变成 React.createElement 的形式。最终形成 html，css，js 等浏览器能够识别的文件。

运行时：接下来当浏览器打开应用的时候，会加载这些文件，然后 js 会通过 React 运行时提供的 API 变成 fiber 树结构，接下来就会形成 DOM 树，然后浏览器用 html 作为载体，加入 css 树和 DOM 树，形成渲染树，这样视图就呈现了。

**Vue 框架本质**

讲完 React 的框架本质原理，再来看看 Vue 相比 React 会有什么区别。

![3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/779d4791f41640d7a88cdfd49d2730fb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1478&h=1118&s=124285&e=png&b=ffffff)

编译时：通过 vue 自带的脚手架，解析 .vue 文件，最终的产物也是 js,css,html。这里有一个细节，就是在 vue 中 template 模版会被编译成渲染函数 render ,渲染函数返回的结构描述了 vue 中的视图表现层。

运行时：运行时和 React 差不多，浏览器会加载相关资源，然后通过 Vue 运行时 api 形成虚拟 DOM 树，并渲染视图。讲完了传统前端框架的本质之后，小程序 DSL 运行本质。

**小程序 DSL 本质：**

讲完 Vue 和 React ，再来看看小程序，前面的章节讲到过，小程序是嵌入到 Native 宿主环境下的移动端 webview 应用。而在移动端，无论是 webview h5 还是小程序本质上都离不开前端三大件，html, css 和 js。只要是通过 webview 渲染的方式，最终的产物就是前端三大件。

下面来回顾一下小程序的运行本质。

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/620b3a9df631467481ce6c833727b510~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1886&h=1478&s=265623&e=png&b=ffffff)

编译时：在编译阶段，wcc 会编译 wxml 文件，wcsc 会编译 wxss ，最终的产物都是浏览器能够识别的视图层 js 。除了视图层 js ，业务 js 也会被处理成逻辑层，最终，逻辑层和视图层，将打包成一个 pkg 压缩包，并上传的云平台上。

运行时：在 Native 启动小程序的时候，会下载压缩包，变成逻辑层的 js 文件，和视图层的 js 文件，并分别在视图层和逻辑层注入小程序的基础库。对于逻辑层的执行，是 Native 创建的独立的 js 引擎来驱动，并完成初始化流程的；对于视图层，则是打开一个 html 文件，加载视图层的 js , 视图层的 js 可以吧样式动态插入 `<head>` 标签里。然后通过 $gwx 找到对应的视图层结构，形成虚拟 DOM 并渲染。

**跨端 DSL 编译时和运行时：**

上面我们分别以编译时和运行时的角度介绍了前端基础框架的运行原理。那么对于跨端 DSL 框架，能够实现跨端开发多端复用的本质也就是通过**编译时**和**运行时**两个手段。

* 编译时：所谓编译时，本质上就是以前端基础框架作为一个模版，在不同平台上，通过 babel 工具链，编译成不同的代码，比如在 web 端编译成前端三大件，在微信小程序上，编译成 wxml, wxss 等，但是本质上它们最终的形态还是前端三大件。

比如某一个跨端框架的一段代码：

```js
class Home extends Component{
    handleClick(){
        XXX.navigateTo({ url:'xxx' })
    }
    render(){
        return <View>
            <View onClick={ this.handleClick } >点击</View>
        </View>
    }
}
```

通过编译，在 web 端，可以直接编译成 React 构建的 web 应用：

```js
class Home extends React.Component{
    handleClick(){
        Router.push('xxx')
    }
    render(){
        return <div>
            <div onClick={ this.handleClick } >点击</div>
        </div>
    }
}
```

也可以编译成微信小程序，如下所示：

```html
<view>
    <view bind:tap="handleClick" >点击</view>
</view>
```

```js
Page({
    handleClick(){
        wx.navigateTo({ url:'xxx' })
    },
})
```

* 运行时：跨端框架也可以通过运行时的方式，对一些功能性的 API 做兼容，比如 Taro3.0 采用了轻编译，重运行时的技术方案，用 Taro3.0 React 构建的小程序，本质上保留了 React 的一些核心特性，其原理就是对 React 的一些方法进行改造。类似如下代码片段。

```js
this.setState = function (){
    /* ... */
    /* 调用小程序的 setData 触发真正的小程序更新  */
    this.setData()
}
```

上面讲到了跨端复用的两种方式，现在我们设计有一个基于 React 语法做 DSL 跨端应用,暂且叫它 myReact，并且能够让它应用在 web 和小程序中，那么应该怎么设计呢？

**以 React 做 DSL 应用转小程序**

![6.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dab227f4a50469dac808ad2d67b7cb2~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1842&h=636&s=118524&e=png&b=ffffff)

先来看一下 myReact DSL 应用怎么转小程序应用。根据编译原理，通过 @babel/parser 将字符串代码转换为 AST，通过 @babel/traverse 遍历我们的 AST ，遍历过程中根据目标代码语法利用 @babel/types 生成目标语法规范 AST 结构。

在 myReact 中，视图层结构是 render 函数返回的内容，需要转化成 wxml 结构，在转换细节中，将 render 拆分为 $$createData() 函数和 wxml 模板代码，&&createData() 函数中将 jsx 中用的的复杂表达式进行抽离，最终达到在 &&createData() 函数中进行复杂的计算，然后将计算结果绑定到 data 上，并驱动模板进行渲染。

举一个例子：比如 myReact 中我们这么写到：

```js
class MyReactDemo extends MyReact.Component{
    state={
        name:'大前端跨端开发指南'
    }
    render(){
        const { name } = this.state
        const list = [1,2,3].map(item=>{
            return name + item
        })
        return <View> 
           { list.map(item=>{ 
               return <View>{item}</View>
           }) }
        </View>
    }
}
```

转换成的 wxml 如下所示：

```html
<view>
    <view wx:for="{{ render_data1 }}" wx:for-item="item" >{{ item }}</view>
</viewe>
```

`$$createData()` 的实现如下所示：

```js
$$createData(){
    const { name } = this.data
    const render_data1 = [1,2,3].map(item=>{
        return name + item
    })
    return {
       render_data1
    }
}
```

**以 React 做 DSL 应用转 web 应用**

![5.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/926d89245ddc4e9d86edaf97a3b0c9ba~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1940&h=764&s=130881&e=png&b=ffffff)

再来看一下 React DSL 应用怎么转 web 应用 ,我们在设计 myReact 的时候，会提供很多 transformer ，这些 transformer 有的处理 DOM 结构，有的处理 JS 。myReact 的源文件，会被这些 transformer 解析成不同的 AST , 然后直接生成以 React 为基础的 web 应用就可以了。比如如下：

```js
class MyReactDemo extends MyReact.Component{
    render(){
        return <View> hello,world </View>
    }
}
```

编译处理后，变成了如下 React web 应用。

```js
import React from 'react'
class MyReactDemo extends React.Component{
    render(){
        return <div> hello,world </div>
    }
}
```

**小程序转 web 应用**

目前市面上也存在着小程序转 web 应用的能力，其本质原理如下所示：

![7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20a99fd5d6424b338461bf5cd8c734ac~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1594&h=752&s=107980&e=png&b=ffffff)

如上小程序在编译阶段形成不同的 AST ，然后在形成 html 和 js 就可以了。

## 四 总结与参考资料

本章节讲了前端 DSL , 以及在 webview 渲染模式下，DSL跨端开发的应用。下一章节中，将重点介绍在 Native 渲染模式下 DSL 跨端开发，以及核心实现原理。

### 参考

* [什么是dsl和作为dsl的cl-loop](https://zhuanlan.zhihu.com/p/379989750 "https://zhuanlan.zhihu.com/p/379989750")