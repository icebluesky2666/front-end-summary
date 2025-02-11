## 一 前言

在上一节，我们讲了 dsl 的工程划分，以及用 node 模拟 Native 层，又讲到了小程序工程最后被编译成 page-service.js 的样子。

本章节将串联上一章节的内容，来继续实现 mydsl 小程序应用。

## 二 通信逻辑

### 2.1 渲染层

首先当 Native 打开一个 webview 页面的时候，本质上 Native 打开一个 html 页面，html 里面引用了渲染层的基础库。我们来看一下渲染层:
![WechatIMG36899.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d83187d6e122469c941f189a74e2530c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=526&h=360&s=36391&e=png&b=262627)

如上渲染层在 devTool 的 public 文件夹下面 , node 应用建立的静态服务器，本质上就是渲染层结构。其中：

* page.html 为渲染层模版，里面加载了基础库的 js 文件。
* boostaps.js 为渲染层的基础库，用来解析渲染指令，绘制真实的视图。
* bridge.js 为 jsbridge 桥通信，使用小册的第三章的 jsbridge 方法，忘记的读者可以回顾一下第三章的内容。
* \_devToolBridge.js 为本地调试环境下独有的文件， 通过 socket 实现与逻辑层通信。

那么首先需要研究的就是—page.html 。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>my dsl project</title>
  <style>
    body{
      margin: 0;
    }
  </style>
</head>

<body>
  <div id="root" />
</body>
<!-- 在调试环境下， dev_tools 通信工具 -->
<script src="./_devToolBridge.js"></script>
<!-- 渲染层基础库——桥通信工具 -->
<script src="./bridge.js"></script>
<!-- 渲染层基础库——页面渲染工具 -->
<script src="./boostaps.js"></script>
<script>
  /* 注册初始化事件 */
  window.JSBridge.registerEvent('ready', function (res) {
    const { pageId } = res
    window.pageId = pageId
    console.log('当前页面 pageId：',window.pageId)
  })
  /* 注册渲染任务 */
  window.JSBridge.registerEvent('render', function (res) {
    const { pageId, data } = res
    if (window.pageId === pageId) {
      handleDirect(data)
      window.isInit = true
    }
  })
  /* 添加样式 */
  window.JSBridge.registerEvent('style',function(res){
    const { pageId, data } = res
    if (window.pageId === pageId) {
      /* 装载样式 */
      setCssToStyleHead(data)
    }
  })
</script>

</html>
```

如上就是 page.html 的内容，只有一个 root 根节点，用于挂载应用，分别引入了在调试环境下， dev\_tools 通信工具 js ；桥通信工具 js 和页面渲染工具 js； 最后通过 JSBridge 注册了事件。

其中 window.JSBridge 是 ./bridge.js 中创建的通信实例。接下来看一下 JSBridge。

### 2.2 渲染层通信 jsBridge

上一章节在介绍 socket 通信的时候，讲到：

```js
/* 接受逻辑层事件 */
wx.onmessage = function (message) {
    console.log(message)
    window._handleNativeEvent && window._handleNativeEvent(message.data);
};
/* 发送渲染层事件。 */
function possNativeMessage(params) {
    wx.send(JSON.stringify(params))
}
```

当 socket 接收到事件之后，会通过 jsBridge 提供 \_handleNativeEvent 触发渲染层对应的函数，实现逻辑层-> 渲染层。 当 jsBridge 向逻辑层通信的时候，只需要调用 possNativeMessage 方法就可以了，实现渲染层 -> 逻辑层。

**真实场景：** 如上只是用 socket 在本地模拟场景下通信的解决方案，在真实场景下，需要 Native 向 jsBridge 通信，具体包括在 window 下绑定方法，或者触发 window 下的全局方法（小册第三章有相关的介绍）。

### 2.3 逻辑层通信 Channel

介绍完渲染层的通信，我们顺势介绍一下逻辑层的通信。逻辑层的通信在 core 文件下下面的 channel 文件中。
![WechatIMG36900.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/425c562016674d31ba946a40a4d933f1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=538&h=354&s=32489&e=png&b=282829)

```js
class Channel {
    constructor(appInstance){
        this.appInstance = appInstance
        global.platform.accept = this.acceptClientMessage.bind(this)
    }
    /* 向渲染端发送事件 */
    postClientMessage(pageId,eventName,direct){
        const message = {
            pageId,
            eventName,
            data:direct
        }
        global.platform.send  && global.platform.send(message)
    }
    /* 接收渲染端事件 */
    acceptClientMessage(message){
        const { type ,...params } = JSON.parse(message)
        this.appInstance.handleMessage(type,params)
    }
    openPage(pageId){
        global.platform.autoOpen && global.platform.autoOpen(pageId)
    }
}
module.exports = Channel
```

在逻辑层初始化的时候，会创建 Channel 实例，里面在 global 对象的 platform 绑定了 accept 和 send 方法。

* 在逻辑层接收到渲染层的事件的时候，会触发 accept 方法，本质上就是调用了 Channel 的 acceptClientMessage 事件，把消息传递给整个应用逻辑层的实例 appInstance。这个方法在 socket 兼容如下：

```js
 /* 监听 message 事件 */
ws.on('message', (message) => {
    setImmediate(() => {
        global.platform.accept && global.platform.accept(message.toString())
    })
})
```

当 socket 接受到 page.html 传递的事件的时候，触发 global.platform.accept 。

**真实场景：** 真实场景下，Native 可以通过 c++ 等方式直接调用对应的方法来实现通信。

* 如果逻辑层想要向渲染层通信的时候，可以调用 postClientMessage 方法，本质上调用的是 global.platform.send 。这样就把消息传递到了渲染层。来看一下 socket 的处理。

```js
/* 向客户端传递事件 */
global.platform.send = function (params) {
    ws.send(JSON.stringify(params))
} 
```

在调试环境，就是通过 socket 的 send 向渲染层传递消息。这样就实现了双向通信。

**如上：在消息双向传递的过程中，需要通过 pageId 建立起页面的唯一标识，需要通过 eventName 找到渲染层对应的事件处理函数。** 在小程序页面创建的时候，会生成一个唯一的页面标识 pageId, 这个 pageId 在业务代码中，可以通过 getPageId 获取到。

* Channel 还有一个方法就是 openPage ，可以打开新的浏览器页面。

![WechatIMG36954.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60f2479475014129886fa89525968bd0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=857&h=409&s=36511&e=png&b=ffffff)

介绍完双向通信流程，再来看一下逻辑层的初始化流程。

## 三 逻辑层初始化流程

逻辑层是小程序的核心，我们实现的 dsl 小程序代码细节可能和市面上的小程序应用相比是冰山一角的，但是其核心思路大体相同。

我们的 dsl 小程序开发模式逻辑层运行，需要一个入口，那就是 driver.js ，代码如下所示：
![WechatIMG36933.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ed3c16ae047443096764f95f665866c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=546&h=328&s=35282&e=png&b=252526)

```js
/*
 驱动整个小程序应用- 模拟运行整个小程序 JS 引擎
*/

/* 设置不同平台 */
global.platform = {}
/* 模拟启动渲染层—启动调试视图层 */
const { AppInit, autoOpen } = require('./devTool/index')

async function init (){
    await AppInit()
    global.platform.autoOpen = autoOpen
    /* 模拟加载应用文件-启动应用的逻辑层 */
    require('./page-service')
}
init()
```

这段代码是整个逻辑层的核心，它驱动整个小程序应用- 模拟运行整个小程序 JS 引擎。它主要做了两件事。

* 首先会预热启动渲染层—调试渲染层，也就是 node 静态服务器，

**真实场景：** 这里的真实场景是在 Native 层驱动完成的。Native 层可以预热预加载视图层。

* 接下来在全局绑定 autoOpen 方法。autoOpen 方法本质上是在本地打开一个新的浏览器页面，然后访问 node 静态服务器，接下来建立通信，完成页面渲染。

**真实场景：** 这里真实场景下，是通过 Native 打开一个 webview 页面。

* 最后就是运行应用文件 `page-service` -启动应用的逻辑层，小程序的逻辑层开始初始化。

在上一章节中，讲到最终编译成 page-service.js 代码，其中有两段代码核心代码。如下:

```js
function handleJS(Page, App, Component, getCurrentPages, mydsl) {
  App({
    onLaunch() {
      console.log(this, '###=========应用初始化')
    },
    globalData: {
      name: '《大前端跨端开发指南》',
    },
  })
}
const app = require('./code/index')
handleJS(null, app.bind(null, pages))
```

如上代码比较重要：

* 首先 handleJS 包装了小程序 demo 应用 project 中的 app.js ，接下来引用基础库的 app。
* 然后执行 handleJS, 此时的 App({}) 的 App 方法就是基础库的 app 方法。app 在执行的时候，通过 bind 的方式，把整个页面的 pages 数组同样传递到基础库，待基础库初始化处理。
![WechatIMG36937.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/16b4520532cf4021b02f7f7cb470db60~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=502&h=356&s=39882&e=png&b=262627)

接下来看一下基础库 code 里面 index 文件：

```js
const AppInstance  = require('./app')
global.mydsl = {}
function App(pages,config){
   const app = new AppInstance(config,pages)
   global.app = app
   mydsl = global.mydsl
   const { navigateBack,navigateTo,redirectTo } = app.navigate 
   mydsl.navigateBack = navigateBack
   mydsl.navigateTo = navigateTo
   mydsl.redirectTo = redirectTo
}
module.exports = App
```

* app js 中代码很简单，首先引入整个 app 的管理实例 AppInstance , 然后初始化实例，把实例 app 绑定到 global 上，然后创建 mydsl 对象，并绑定页面栈跳转，回退，重定向的方法。类似于微信中的 wx.navigateTo, wx.navigateBack, wx.redirectTo。

这样就可以在 mydsl 使用对应的方法了，比如:

```js
onLoad: function (options) {
    // 生命周期函数--监听页面加载
    console.log(mydsl.navigateTo)
},
/* 实现页面的跳转  */
handleRouterGo() {
    mydsl.navigateTo({ url: 'page/test/index' })
},
```

小程序全局对象 mydsl , wx 的实现，就是通过这种方式。

接下来就是最核心的 appInstance , 它负责调度整个小程序的逻辑层。一方面建立起通信机制，另一方面维护着小程序的页面栈。

![WechatIMG36940.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1e1c81296c843e3818b8af798e40edb~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=291&h=176&s=11469&e=png&b=212122)

```js
const Navigate = require('./navigate')
const Page = require('./page')
const Channel = require('./channel')

class AppIntance {
    /**
     * 
     * @param {*} query  应用初始化
     * @param {*} appConfig 
     * @param {*} pageServices 
     */
    constructor(appConfig, pageServices) {
        /* 初始化参数 */
        this.appConfig = appConfig
        this.pageServices = pageServices
        this.initApp()
    }
    initApp() {
        /* 建立通信 */
        this.channel = new Channel(this)
        this.navigate = new Navigate(this)
        process.nextTick(()=>{
            this.launch()
        })
    }
    /* 初始化小程序应用 */
    launch(){
        this.appConfig.onLaunch()
         /* 初始化第一个页面 */
        const fristPage = this.pageServices[0]
        this.navigate.navigateTo({ url:fristPage.path + '?init=true' })
    }
    /* 创建一个新页面 */
    createPage(path) {
        /* 获取路由 */
        let pageConfig = null
        for(let i=0;i< this.pageServices.length;i++){
            const currentPageConfig = this.pageServices[i]
            if(currentPageConfig.path === path){
                pageConfig = currentPageConfig
                break
            }
        }
        return new Page(this,pageConfig)
    }
    render(pageId,directList){
        this.channel.postClientMessage(pageId,'render',directList)
    }
    styleSheet(pageId,styleString){
        this.channel.postClientMessage(pageId,'style',styleString)
    }
    pageReady(pageId){
        this.channel.postClientMessage(pageId,'ready',{})
    }
    openPage(pageId){
        this.channel.openPage(pageId)
    }
    /* 通过页面 id 获取页面 */
    getPageInstanceById(pageId){
        return this.navigate.getPageInstanceById(pageId)
    }
    /* 处理渲染层事件 */
    handleMessage(type, params){
        if(type === 'event'){
            this.handleEvent(params)
        }else if(type === 'ready'){
            const pageControllerInstance = this.getPageInstanceById(params.pageId)
            const pageRefIntance = pageControllerInstance.pageRef
            pageRefIntance.onReady && pageRefIntance.onReady.call(pageRefIntance)
        }
    } 
    /* 处理事件 */
    handleEvent(params){
        const { pageId, eventName, ...otherParams } = params
        const pageControllerInstance = this.getPageInstanceById(pageId)
        const pageRefIntance = pageControllerInstance.pageRef
        const funEvent = pageRefIntance[eventName] || pageRefIntance['methods']?.[eventName]
        funEvent.call(pageRefIntance,otherParams)
    }
}
module.exports = AppIntance
```

AppIntance 内容比较多，我们一步步来分析。

* 初始化，首先就是初始化过程中，会绑定 appConfig, pageServices, 其中 appConfig 就是整个 project 引用中 app.js 的产物。pageServices 就是 project 中 page 文件夹下面的内容。

* 接下来会执行 initApp 方法，在这个方法中，会初始化通信类 Channel 和页面栈管理类 Navigate ，接下来就是调用 launch 启动小程序应用了。

* 在 launch 内部，首先会执行，小程序 app 的 onLaunch 生命周期，然后对标微信小程序，会默认跳转到应用 page 的第一个页面。

* createPage 比较重要，负责创建小程序的页面栈和页面实例，当创建一个页面的时候，会在 pages 文件中找到页面解析好的文件，里面包括了 js （js 文件产物）,render 函数 （myxml 文件产物），css （mycss 文件产物），然后通过 new Page({}) 完成页面实例创建。

通过上面的几个步骤，小程序的第一个页面就开始初始化了。接下来小程序会调用渲染方法去渲染页面。（具体细节在下一章中会讲到）

在初始化过程中，会通过 openPage 打开浏览器页面，会调用 render 方法触发，向渲染层传递渲染指令。会调用 styleSheet 传递 css 样式，通过 pageReady 告诉逻辑层已经准备就绪。

* 对于渲染层的事件，appInstance 通过 handleMessage 来接收，当渲染层完成通信，会触发 ready 回调，这个时候，就调用页面的 onReady 生命周期。如果是渲染层触发了事件，就会触发 event 回调，接下来通过 getPageInstanceById 找到对应的页面 page ,然后调用对应的方法。

比如在 project 的 home 页 myxml 中绑定事件。

![WechatIMG36941.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/84c4fb19d2ea41ce9929d7fd9b47560a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=594&h=47&s=9224&e=png&b=1d1d1d)

这个事件会在渲染层绑定，具体怎么绑定下一章会介绍。

![WechatIMG36942.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1f965e1bc0645d49dc2d2b46d23c3ec~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=339&h=136&s=14515&e=png&b=1c1c1c)

![WechatIMG36943.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2879ffd8c40e4af3afc1e42dcee5f3d7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=261&h=40&s=4575&e=png&b=1d1d1d)

通过上述操作后，事件就可以在逻辑层执行。

Channel 通信类上面已经讲到了，接下来看一下页面管理类 Navigate，对于 Navigate 前面章节已经介绍了，这里补充一下细节。
![WechatIMG36946.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdcd7390049747259e96f6816aa7a197~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=526&h=362&s=34098&e=png&b=29292a)

Navigate 代码如下所示：

```js
const utils = require('./utils')
class Navigate {
    pageStack = [] //保存页面栈信息
    maxPageLimit = 10
    constructor(appInstance) {
        this.appInstance = appInstance
        this.navigateTo = this.navigateTo.bind(this)
        this.getCurrentPages = this.getCurrentPages.bind(this)
        this.navigateBack = this.navigateBack.bind(this)
        this.redirectTo = this.redirectTo.bind(this)
    }
    navigateTo({ url }){
        if (this.pageStack.length === this.maxPageLimit) {
            // 爆栈了，那么跳转失败
            throw new Error('页面栈已满')
        }
        const [originPath, query] = utils.parseQueryString(url)
        /* 当前最上层的 WebView 页面 */
        const stackTopPage = this.pageStack[this.pageStack.length - 1]

        /* 创建一个新的页面 */
        const page = this.appInstance.createPage(originPath)
        if(!page) return new Error('页面不存在')
        this.appInstance.openPage(page.pageId)
        if (stackTopPage) {
            /* 当前页面需要改变状态，变成未激活状态 */
            stackTopPage.unActive()
        }
        /* 把当前页面放入页面栈 */
        this.pageStack.push(page)
        setTimeout(()=>{
            /* 启动新的 WebView */
            page.launch(query)
        },500)
    }
    redirectTo(){
       ...
    }
    navigateBack(){
       ...
    }
    /* 获取页面栈 */
    getCurrentPages(){
        return this.pageStack
    }
    /* 获取当前页面 */
    getPageInstanceById(pageId){
        let currentPage = null
        for(let i = 0;i < this.pageStack.length;i++){
            const page = this.pageStack[i]
            if(page.pageId === pageId){
                currentPage = page
                break
            }
        }
        return currentPage
    }
}

module.exports = Navigate
```

* 首先就是最重要的 navigateTo , navigateTo 会判断页面栈是否已经满了，如果满了阻止页面跳转，然后解析页面的 url 参数，变成 query 对象, 我们都知道小程序中 url 参数是以对象的形式，传递到小程序的 onLoad 的生命周期的，如下所示：

```js
onLoad(query){
    console.log(query) // object
}
```

* 然后通过 app 实例的 createPage 创建一个页面栈， 调用 openPage 打开页面。
* 最后把当前的页面放入页面栈中。这里通过 setTimeout 创建一个短暂的延时，因为 openPage 的实现，本质上是打开浏览器，这个过程是异步的，需要一些时间，所以创建一个延时，让浏览器页面打开，再进行页面的初始化操作。真实场景没有这一步。
* 除此之外，还有一些跳转方法，这里省略了。
* 还有一些工具方法，比如 getCurrentPages 这个方法用来获取页面栈，也是作为参数通过 handleJS 传递到业务层中。还有就是根据 pageId 查找页面实例的方法 getPageInstanceById。

到此为止，整个页面的初始化就完成了。

![WechatIMG36955.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89800e04d0014d32a29a10b8174d973a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1064&h=563&s=49214&e=png&b=ffffff)

**待完善点：**

* 1 组件维度的处理。本应用中，对于文件的解析，只分析到了页面维度，没有拓展到组件维度。

## 四 总结

本章介绍了 mydsl 引用的通信流程，以及应用的初始化流程，在下一章节中，将继续介绍渲染层的实现原理。