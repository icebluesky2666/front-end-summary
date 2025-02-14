## 一 前言

接下来从零到一简单实现以小程序语法作为 DSL 的跨端应用，让它可以运行在多个平台上。本章节将介绍整体的架构设计。

在正式介绍之前，来回顾一下小程序应用和 web 应用和 Native 跨端应用到底有什么区别？

### 1.1 传统 web 应用

**宿主环境：** 传统的 web 应用的的宿主环境是浏览器环境。可以直接使用 dom 和 bom 相应的 api。

**组成部分**：web 应用本质上是 Native 打开一个 WebView 容器，本质上和浏览器打开一个页面类似，主要组成部分就是前端 html 和 css 和 js 三大件，如果是通过前端框架（Vue 或者 React）构建的，那么组成上还包括前端框架。

**运行时模式：** 传统 web 应用运行时比较简单，就是通过前端框架能力形成虚拟 DOM ，然后直接调用 DOM api 方法渲染视图。从本质上来看，业务逻辑层和视图渲染层是一起的。

### 1.2 小程序应用

**宿主环境：** 小程序的虽然也是 webview 也就是浏览器，但是从整体应用的角度分析，小程序逻辑层的宿主本质上是 Native ，包括小程序应用的初始化和页面的切换，都是通过 Native 通信并驱动完成的，但是小程序的渲染层宿主本质上是浏览器环境。

**组成部分：** 小程序的组成部分比较负责，分为：

* Native 部分，负责管理小程序的 webview ，运行小程序的逻辑层代码，初始化和调度小程序应用，与小程序的逻辑层和渲染层通信。
* 逻辑层部分，小程序的逻辑层，本质上就是一个 JS 线程，包括逻辑层的基础库，比如微信小程序中 wx 下面的方法，还有运行时业务代码，开发者就是在这个 JS 线程开发的，这个 JS 渲染并不是在浏览器中执行的，所以不能用浏览器提供的 Api, 做到了与浏览器隔离。
* 渲染层部分，小程序的渲染层，本质上就是小程序提供的前端基础库，里面包括了 html 和 js ,开发者不能直接操控渲染层，渲染层可以和 Native 通信，来接收渲染指令，并渲染真实的页面。

**运行时模式：** 小程序的运行时模式，采用了耳熟能详的**双线程架构**, 开发者在逻辑层开发，然后向 Native 通信，再有 Native 层向渲染层通信，然后渲染视图。

### 1.3 Native 跨端应用

**宿主环境：** Native 跨端应用无论是渲染层还是逻辑层都是完全由 Native 驱动的，宿主环境完全是 Native。

**组成部分：** Native 跨端应用，比如 React Native ，分为：

* Native 部分：包括 Native 负责渲染的部分，和负责与 JS 层通信的部分。
* JS 组成部分：在 Native 层运行一个 JS 引擎，里面运行业务的 JS 代码和前端基础库代码。

**运行时模式** Native 跨端模式运行时比较简单，Native 运行 JS bundle ，在 JS 中构建出虚拟 DOM ，然后把渲染指令传递给 Native ,由 Native 完成渲染流程。

![1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2190bb56144c4b898d605d1ef970a82d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1876&h=710&s=186801&e=png&b=ffffff)

明白了几种跨端形式之后，方便我们设计跨端应用，并且可以捋清楚需要做哪些事情。

## 二 模块设计

接下来我们来梳理一个 DSL 小程序应用的核心部分，并极简的实现一个小程序功能 （**对于整体技术流程实现，纯个人设计，望理解。市面上的小程序实现本质上也是大同小异的**）。

### 2.1 DSL 模块职责设计

在前面的章节中，介绍了解析 myxml 的流程，那么本章节还是以 myxml 模版语法作为 DSL 的视图结构，以小程序 Page(config) 作为逻辑层结构。举一个例子，开发一个页面如下样子：

![2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9f87ac7dd924ae08049f26d239c4f25~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=356&h=178&s=17545&e=png&b=2a2a2c)

\-index.js

```js
Page({
    data:{},
    methods
})
```

* index 存放业务代码，业务处理逻辑。

\-index.json

* 这个 json 和微信小程序一致。

\-index.myxml

```html
<view bind:tap="handleClick" class="text {{ customClass }}"  >
  <view >作者：我不是外星人</view> 
  <text >名称：《前端跨端进阶指南》</text> 
</view>
```

* 如上在 `index.myxml`中，描述视图结构，和小程序是一样的。

\-index.myxss

```js
.text{
    color:#ccc;
    height:300rpx;
    width:200rpx
}
```

* 如上在 `index.myxss` 中，写了样式。

再来回顾一下初衷——想要实运行在多个平台上，就需要把逻辑层和渲染层分开，还是以 web 或者小程序平台为例子，看一下应该去实现哪些模块。

**运行时：**

* 逻辑层基础库：首先就是实现逻辑层，比如应用管理器 AppInstance, 页面构造器 Page ，组件管理器 Component，页面栈管理器，通信管理器。
* 渲染层基础库：渲染层处理渲染指令，还有 DOM 元素组件模块等。
* 中间层通信层：模拟小程序 Native 层，负责与逻辑层和渲染层通信。

**编译时：**

* myxml 解析器：解析业务写的 myxml 文件。
* myxss 解析器：解析业务写的 myxss 文件。

### 2.2 DSL 运行时逻辑层模块设计

描述了 DSL 每一个模块的职责之后，以运行时为重点，详细介绍每一个模块是怎么串联在一起的。

**应用维度：** 首先当运行整个应用的时候，需要一个应用级别的 App 实例，这个实例中保存了整个 App 的信息，其中包括描述整个应用的生命周期。并与容器层建立关联，可以容器层接收传递信息。

**页面维度：**

每当进入一个页面的时候，会创建一个页面 Page 实例，与此同时会创建一个页面唯一的表示 pageId，里面保存了页面信息，来看一下微信里面 Page 实例里面都包含了什么？

每次进入一个页面会产生一个新的页面实例，但页面不能一直创建，这样会让系统内存吃不消，并且需要一个类 Navigator 去管理页面栈的情况，在内存中，维护一个页面栈结构，创建页面，入栈，退出页面，清除栈顶页面实例，重定向页面，清除栈顶页面并创建新的页面。

**组件维度：**

每次创建一个新的组件，会构建一个组件实例，组件实例描述组件内部的状态。页面可以通过 selectComponent 或者 selectAllComponents 找到对应的组件实例。

**通信维度：**

逻辑层最终是需要和渲染层通信的，也需要监听渲染层传递的信息，这个时候需要一个通信管理类 ChannelManager 来管理。

**虚拟 DOM 维度：**

在逻辑层本质上会会执行 wxml 结构解析成的渲染函数，并且形成虚拟 DOM，并且维护着虚拟 DOM 树，当发生更新的时候，会通过 diff 对比哪些虚拟 DOM 发生变化（元素增加，元素删除，元素修改），然后向渲染层发送指令。

### 2.3 DSL 运行时渲染层模块设计

介绍完逻辑层之后，来看一渲染层的模块设计。渲染层的执行环境决定于终端平台（Android，iOS web）,想要让代码跨端运行多个平台，逻辑层是可以共用的，但是渲染层，就需要终端平台单独实现，像 RN 一样，RN 在 JS 层的基础库代码是一套的，但是渲染层，需要各个平台单独实现，所以在 iOS 和 Android 需要两套不同的渲染层代码。

今天我们设计的应用选择 web 平台作为渲染层。那么来盘点一下需要做哪些事情。

**通信模块：**

首先就是通信模块，需要和逻辑层通信，那么同样需要一个对应的 ChannelManager 来进行桥通信管理。

**渲染模块：**

在渲染端最重要就是渲染基础库了，它主要负责接收逻辑层传过来的渲染指令，然后根据指令渲染视图。

## 三 系统运行时流程

模块设计讲完了，来看一下整体运行时流程。有一些核心节点是必须要弄清楚的。

* 应用是怎么初始化的？初始化的时候做了哪些事情，初始化页面是怎么渲染的。
* 页面逻辑层发生更新之后，是怎么进行数据对比，并发生更新的。
* 当页面发生跳转或者返回的时候，是怎么创建新页面，或者销毁页面的。

带着这些问题，来看一下流程的设计。

### 3.1 初始化流程

首先看一下初始化流程设计图：

![4.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99f8b17fb2194376ac0292f8478cb97a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2076&h=1154&s=128342&e=png&b=ffffff)

在整个应用初始化流程中，首先会创建整个应用中心 AppInstance，AppInstance 保存了整个应用的状态，也描述了整个应用运行时的状态，接下来会完成一些初始化动作，初始化应用的每一个模块，其中比较重要的就是页面栈管理模块 RouterInstance ，桥通信模块。

因为 DSL 小程序初始化应用，会加载初始化页面，在路由页面栈初始化的时候会创建第一个页面 PageInstance ，与此同时和渲染层建立通信，等渲染层完成初始化渲染后，会开始进行初始化逻辑层渲染准备工作。

在初始化页面 PageInstance 完成的时候，会抽取页面逻辑中 wxml 视图模块和 js 逻辑模块，通过解析 wxml 生成渲染函数，生成虚拟 DOM, 然后运行页面的 onLoad 等流程，接下来就到了渲染环节了，会向渲染层发送渲染指令 。

接下来渲染指令会通过桥通信的方式，传递到渲染层。渲染层解析指令，完成初始化渲染，最后把信息回传到逻辑层。

### 3.2 更新渲染流程

再来看一下数据更新流程：

![5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3567d3e16ce4e5aa98c2d870e1a3a04~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=2116&h=1240&s=141401&e=png&b=ffffff)

当触发更新的时候，会调用 setData, 会重新生成新的节点，然后对比新老节点的变化，发生变化的节点，会收集更新指令，然后把消息传递到渲染层，渲染层更新视图，再把信息回传到逻辑层。

### 3.3 页面切换流程

再来看一下切换页面的流程：

**页面跳转：**

当页面发生跳转的时候，RouterInstance 会创建一个新的页面，更换当前页面 unActive 状态，然后把页面放入页面栈中，接下来完成初始化流程。

**页面回退：**

当页面返回的时候，当前页面会销毁，从页面栈剔除，然后把上一个页面状态置成 active 状态。

## 四 总结

本章节介绍了从零到一实现 DSL 应用的整体设计，在接下来的章节中，我将通过代码实践加上原理剖析的方式，详细讲解实现细节。