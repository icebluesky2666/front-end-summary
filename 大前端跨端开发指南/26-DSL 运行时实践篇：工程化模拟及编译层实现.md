## 一 前言

### 1.1 应用介绍

接下来我们将从零到一实现小程序 DSL 应用的整个流程。核心思路通过编译 myxml mycss js 文件，让小程序应用运行在 node 端，再通过node 端运行小程序运行时代码，构建出虚拟 Dom，然后通过 socket 把渲染指令传递到终端(浏览器端)，终端通过基础库解释指令，完成页面的渲染整体。

当然有了渲染指令，就可以在 iOS, 安卓，web ,甚至鸿蒙 os 任何一个平台渲染。这就是跨端魅力所在。

正常的跨端应用，比如 React Native 或者是小程序，是需要 Native 作为整体应用的载体的，负责 js 代码的执行调度和视图层与渲染层的通信。这里为了让大家更清晰的了解全流程。放弃了 Native 作为载体，取而代之的是 node 和 socket。

* node 负责运行 dsl 应用的逻辑层代码。
* web socket 负责逻辑层和渲染层的通信。

如果把我们的 dsl 应用 node 换成 Native 的 JS 引擎驱动，把 socket 换成 Native 与 webview 以及 js 逻辑层的通信，就可以完全让我们的 dsl 应用运行在 Native 端（小程序 webview 渲染）。如果再把 webview 换成 Native 渲染，就成了 Native 渲染模式的应用 （RN 原生渲染）。所以**我们只要掌握一套流程模式，就可以适配到不同的平台，就完成了跨度应用的开发。**

项目链接：[my-dsl-project](https://github.com/GoodLuckAlien/my-dsl-project "https://github.com/GoodLuckAlien/my-dsl-project")

先来看一下整体效果：

**编译阶段—编译文件：**

![1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8851259a71594101add568f713a217d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=690&h=388&s=1075520&e=gif&f=50&b=1c1c1c)

**运行小程序应用：**

![2.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8401d8e2ca24227aa0fd9f58bf48f30~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=690&h=388&s=386292&e=gif&f=78&b=1e1e1e)

**setData 触发更新：**

![3.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdf97b8c5b104aeca3031fbb85c3a516~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=690&h=388&s=181526&e=gif&f=52&b=efefef)

**navigateTo 跳转：**

![4.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/621784cb17564e2fbfc5287562c88255~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=690&h=388&s=135594&e=gif&f=47&b=efefef)

dsl 应用运行前：

![WechatIMG36811.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31dbc263807a42ef93d09bbf5794a2c1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1908&h=1054&s=493158&e=png&b=1e1e1e)

dsl 应用运行后：

![WechatIMG36809.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5ecd3ab0ce14fad8ab24e20ec965c6d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=3004&h=1644&s=590356&e=png&b=f6f6f6)

首先就是整体的工程介绍：
![WechatIMG36816.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6987b074ed694ddfb1e4461ea425fe6d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=572&h=318&s=31288&e=png&b=272728)

其中核心的组成部分如下：

* bootraps 负责 dsl 应用的渲染层的基础库，渲染层核心代码, 在打开一个 webview 的时候，会加载渲染层基础库，负责和逻辑层的通信，同时负责页面的展示。
* core 为逻辑层的基础库，里面提供了业务运行时所需要的 Api ，可以生成虚拟 DOM ,并通过通信让视图层完成渲染。
* project 是我们写的一个 demo 项目，这里我们 myxml mycss js 结构实现了一个掘金的 「我的」页面。
* compile 为编译时代码，可以把 project 编译成小程序业务运行时代码 page-service.js 。
* page-service.js 这个是 compile 编译 project 项目产物，在实际开发场景中，就是业务代码。
* devTool 因为这个项目是用 node 模拟 Native 层，所以这个里面存放 node 调试文件。负责逻辑层和视图层的串联。
* driver.js 这里提供的是运行整个项目的收口文件。

按照流程节点上分为如下：

编译时：

* project
* compile

运行时逻辑层：

* core
* page-service.js

运行时渲染层：

* bootraps

调试层（模拟 Nativve 中间层）

* devTool

接下来开始实现我们的 dsl 应用了，在正式开始之前，先来了解一个知识点，那就是跨端应用是这么真机调试的呢？

### 1.2 本地调试流程

无论我们开发小程序也好，还是开发 RN 等跨端应用，本地调试是必不可少的一个环节。跨端一般需要移动端设备和本地开发 ide 工具。开发者通过 ide 开发，需要实时在真机上看到效果；同理真机上的信息（比如异常，日志）也同样需要开发者工具正常显示。

能够实现这个功能，就需要 ide 工具和真机建立起双向通信。其主要实现流程如下：

* 开发者本地修改了代码，ide 监控到代码的修改，然后把最新的产物上传到 oss 平台。
* 真机通过扫码等方式，拉取到 oss 平台最新的代码产物，并通过内置代码和 ide 建立起通信关系。渲染最新的代码。
* 因为已经建立了通信关系，所以真机上的一些交互动作，核心日志能够回传到 ide ，完成整个真机调试流程。

![WechatIMG36846.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee838ab363094b35b0fbba09a369072c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=681&h=426&s=42496&e=png&b=fefefe)

回到本章的核心内容上来，接下来将**串联整本小册的知识点**，开始实现我们的 dsl 应用之旅吧。

## 二 工程准备-本地调试

因为 Native 的一些核心流程都是通过 node 来模拟的，所以需要一些知识铺垫。

### 2.1 搭建本地服务器

首先回顾一下微信小程序的流程，当打开一个页面的时候，需要 Native 调度去创建一个 webview ， 这个流程就需要 node 来实现了。

**模拟实现**: 创建一个 webview 本质上就是打开一个新的 html 加载新的基础库，如果想要模拟这个流程，就需要 node 建立一个静态服务器，用来渲染逻辑层。来看一下核心实现：

```js
function AppInit() {
    return new Promise((reolve) => {
        // 导入express
        const express = require("express");
        // 创建web服务器
        const app = express();
        // 启动服务器

        app.use(express.static(__dirname + '/public'));

        app.listen(80, async () => {
            /* 创建长链接  */
            const sockeChanneltDriver = require('./socket-driver')
            await sockeChanneltDriver()
            reolve()
        });
    })
}
AppInit()
```

这里用了 express 框架简单搭建了一个本地服务器。监听 80 端口，然后通过 node 命令运行 js 文件。在浏览器访问 `http://127.0.0.1/` 就可以访问到我们的静态服务器了。

![WechatIMG36829.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24851a0c45d14b7b82c6e331e3b3a683~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1754&h=460&s=52514&e=png&b=fefefe)

接下来通过 `express.static` 放置静态文件文件夹 public， 在 public 里面新建 index.html 。
![WechatIMG36830.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7c75a76b8c845cd8799958ac83b0e3a~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=546&h=580&s=73555&e=png&b=272728)

在 index.html 中写入：

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
    <div>hello,world</div>
</body>
</html>
```

接下来就可以本地访问 index.html 了。

![WechatIMG36831.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7a27bdb5a434bff8e81aa3e3626de90~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1546&h=580&s=58566&e=png&b=fefefe)

到此为止，我们完成了第一步，接下来除了 html，静态文件夹 public 下面还要有渲染层的基础库 bootraps。

**真实场景：** 在小程序的真实场景中，这里的渲染层基础库文件，是与渲染的 html 文件统一存放在基础库中的。当小程序一个页面加载，html 就会被渲染，渲染基础库 js 也会在渲染层被加载并执行。

完成第一步之后，就需要建立起渲染层和逻辑层的通信了。

### 2.2 socket 链接

**模拟实现**: 这里采用了 socket 来模拟，渲染层和逻辑层的通信，在真实小程序场景中，逻辑层和渲染层是通过 Native 中间层来实现的。来看一下核心实现：

```js
function sockeChanneltDriver() {
    return new Promise((resolve) => {
        const WebSocket = require('ws')
        const WebSocketServer = WebSocket.Server;

        // 创建 websocket 服务器 监听在 3000 端口
        const wss = new WebSocketServer({ port: 3000 })
        /* 创建链接 */
        wss.on('connection', (ws) => {
            /* 监听 message 事件 */
            ws.on('message', (message) => {
                setImmediate(() => {
                    console.log(message.toString())
                    global.platform.accept && global.platform.accept(message.toString())
                })
            })
            /* 向客户端传递事件 */
            global.platform.send = function (params) {
                ws.send(JSON.stringify(params))
            } 
            console.log('socket 已经链接')

            setTimeout(()=>{
                global.platform.send({ msg:'hello,world' })
            },3000)
        })


        resolve()
    })
}

module.exports = sockeChanneltDriver
```

创建静态服务器之后，开始建立 socket 链接，这里用了一个 ws 库，来和浏览器端建立起链接。当创建成功建立链接之后，会触发 connection 事件，然后监听客户端传来的消息 message 。如果发送事件就会 send ,如上我们三秒后，向浏览器发送事件。

接收客户端的内容，结构是 buffer , 需要用 toString 变成 string 字符串。

string 前： ![2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94eced3a097c465bb18c8c2f29d65aef~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1328&h=402&s=102432&e=png&b=1e1e1e)

string 后： ![3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8815a2a9a4d043eebb61191c0605d7f7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1346&h=130&s=38072&e=png&b=1e1e1e)

建立连接：

![WechatIMG36834.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e33b4f7e6f6a446ca6943eaedbbe4b32~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=412&h=36&s=7973&e=png&b=1f1f1f)

说完了服务端 socket 创建，接下来看一下浏览器中 socket 的创建。

```js
/* dev_tool 本地调试模块  */
function devtoolClientServer() {
  if(window.wx) return
  window.wx = new WebSocket("ws://127.0.0.1:3000");
  wx.onopen = function () {
    const payload = {
      eventName: "connect",
      data: null,
    };
    // 以下通信章节讲到
    window.JSBridge.postMessage(payload)
  };
  wx.onmessage = function (message) {
    console.log(message)
    // 以下通信章节讲到
    window._handleNativeEvent && window._handleNativeEvent(message.data);
  };
}

devtoolClientServer()
// 以下通信章节讲到
function possNativeMessage(params) {
    /* 向服务端发起事件 */
    wx.send(JSON.stringify(params))
}
```

当浏览器创建 socket 的时候，通过 new WebSocket 创建一个 socket 实例。

* onopen 当 socket 打开的时候，会触发 onopen 回调。
* 当向服务端消息，会调用 send 事件。
* 监听服务端事件，可以执行 onmessage 回调。

客户端接收信息：
![WechatIMG36833.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67ab686df4534e2fb6dfb1a1a97260e1~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=700&h=104&s=15864&e=png&b=282828)

目前已经通过 socket 模拟了渲染层和逻辑层的通信。

### 2.3 自动打开浏览器窗口

在小程序应用中, webview 是通过 Native 调度打开的，本质上 webview 就是 Native 的一个组件，因为我们这个 dsl 应用需要 node 驱动，所以需要 node 自动打开浏览器。封装的方法如下：

```js
// -自动打开略览器-模拟 Native 打开一个新的页面
function autoOpen(pageid) {
    var childProcess = require("child_process");
    childProcess.exec(`open "http://127.0.0.1/page.html?pageId=${pageid}"`);
}
```

如上通过 child\_process 创建一个子进程，然后通过 exec 运行终端命令就可以自动打开浏览器了。

**模拟：** 模拟 Native 打开一个新的页面。

![WechatIMG36847.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1de49bc2774e4d589e9d6eefc78ff273~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=650&h=300&s=21390&e=png&b=ffffff)

## 三 工程准备-编译能力强化

如上讲到了小程序 dsl 应用的工程分类，以及 Native 层和通信层的模拟。接下来看一下业务代码是怎么处理的。

### 3.1 创建小程序工程

接下来我们创建一个我们自己实现的小程序应用, 项目文件中的 project。文件目录如下所示：

![WechatIMG36836.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/245be7a5a7414b8c940062a2cfb7ccd8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=270&h=280&s=16739&e=png&b=222223)

如上就是一个简化的小程序结构，app.js 为整个应用级文件，小程序启动会运行这个文件。

```js
App({
    onLaunch(){
        console.log(this,'###=========应用初始化')
    },
    globalData:{
        name:'《大前端跨端开发指南》',
    },
})
```

app 描述了整个小程序的信息。app.json 描述了整个应用信息。

```json
{
    "pages":[
        "page/home/index",
        "page/test/index"
    ]
}
```

如上在 app.json 中，pages 代表页面数据，里面有两个页面。分别对应 home 和 test 两个页面。

以 home 为例子，里面有：

* index.js home 页面的逻辑层，对应小程序的 js。
* index.json 对应小程序的 json。
* index.mycss 对应小程序的 wxss，存放样式。
* index.myxml 对应小程序的 wxml，存放页面结构。

这里重点看一下 js 和 myxml:

```js
Page({
    data: {
        name: 'Alien',
        image: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
        myImage: 'https://p9-passport.byteacctimg.com/img/user-avatar/67ae50d1ec26c12c2ab04bc8ab52bd5f~80x80.awebp'
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        console.log(mydsl.navigateTo)
    },
    onReady() {
        console.log('页面初始化完成=======>')
    },
    onShow: function () {
        // 生命周期函数--监听页面显示
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏
    },
    handleClick() {
        console.log('点击事件')
        this.setData({
            name: '我不是外星人'
        })
    },
    handleRouterGo() {
        mydsl.navigateTo({ url: 'page/test/index' })
    }
})
```

如上页面的逻辑层。其中用 mydsl 代替了 wx ；handleClick 方法触发 setData 更新视图 ；handleRouterGo 方法是路由跳转。

myxml 结构和小程序 wxml 一样，本文开头的 myxml 内部过于复杂，会带来阅读困恼，这里简单写一个 myxml 的 demo 。 如下：

```js
<view>
   <text>{{ name }}</text>
   <bottom bind:tap="handleClick" >点击</bottom>
</view>
```

如上就是一个简单的 mydsl 小程序应用，接下来看一下会被编译成什么样子。

### 3.2 编译入口

我们的整个小程序应用逻辑层（包括市面上其他的小程序），**最后都会被编译成一个文件**。那么我们接下来的任务就是把 project 编译成 page-service.js 文件。

整个编译项目的结构如下所示：

![WechatIMG36837.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f98abd32ea7f4056b6976b94f52e7d18~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=271&h=218&s=13479&e=png&b=212122)

如上当我们在终端运行 node index.js 的命令，就会编译整个 project 项目。

* 其中 js mycss 和 myxml 文件夹分别用来解析 js 文件，mycss 文件和 myxml 文件。
* index 为整个应用编译层的入口。

**现实场景：** 在现实场景中，对于文件的编译，一般都内嵌于小程序的 ide 中。比如微信，微信开发者工具就已经把微信应用进行了系统的编译处理。

**解析流程：**

* 首先 index.js 会通过 `analyticProject` 解析整个项目，会解析 project 项目里面 app.json 文件，因为里面有两个 page。 代码如下所示：

```js
const readPath = '../project/'
const writePath = '../page-service.js'
const jsNotion = '.js'
const myxmlNotion = '.myxml'
const mycssNotion = '.mycss'
const pageCodes = []
/* 读取小程序应用的 app.json 文件，分析页面 */
function analyticProject(path){
   return new Promise((resolve)=>{
        fs.readFile(path,'utf-8',(err,data)=>{
            const projectConfig = JSON.parse(data)
            /* 获取整个应用的 page 页面 */
            const { pages } = projectConfig // [ 'page/test/index' , 'page/home/index' ]
            resolve(pages)
        })
   })
}
```

如上通过 fs 模块的 readFile 直接读取 json 文件，然后读取里面 pages 数组。

接下来遍历数组的每一个页面，把页面构造成制定的结构。

```js
analyticProject(readPath + 'app.json').then(pages=>{
    pages.forEach(analyticPage)
    /* 生成目标代码 */
    const codeContext = new CodeContext()
    /* ---------------以下是构建 page------------------- */
    codeContext.pushCode('const pages = [')
    codeContext.indent()
    pageCodes.forEach((pageCode,index)=>{
         if(index === pageCodes.length - 1) codeContext.pushCode(pageCode)
         else codeContext.pushCode(pageCode + ',')
         codeContext.indent()
    })
    codeContext.indent()
    codeContext.pushCode(']')
     /* --------------构建完成-------------------- */
    codeContext.indent()
    /* -------------装载 app  -----------------*/
    const appCode = walkAppJs()
    codeContext.pushCode(appCode)
    codeContext.indent()
    /* 运行 app ，引入基础库代码 */
    codeContext.pushCode(`const app = require('./code/index')`)
    codeContext.indent()
    /* 执行应用代码 */
    codeContext.pushCode(`handleJS(null,app.bind(null,pages))`)
    /* 写入 code 把 code 写入 page-service.js */
    fs.writeFileSync(writePath,codeContext.code)    
})
```

这段代码比较复杂，也比较重要。首先把每一个页面进行文件解析，解析成

```js
const page = [
    {
        path:'page/home/index'
        js:...
        render:...
        css:...
    },
    {
        path:'page/test/index'
    }
]
```

如上 js render css 分别代表小程序的 .js，.myxml .mycss 文件。最后需要把业务层的代码和小程序逻辑层的代码**桥接起来**，并装载项目的 app.js 。对应的代码如下:

```js
/* 解析页面配置信息 */
function analyticPage(pagePath){
    const isExists = fs.existsSync(readPath + pagePath + jsNotion)
    if(!isExists) return
    const code =`{
        path:'${pagePath}',
        js:${walkJS(pagePath)},
        render:${walkMyxml(pagePath)},
        css:${walkMycss(pagePath)}
    }`
    pageCodes.push(code)
}
```

如上，解析页面结构：

* walkJS 用于解析 js 文件；
* walkMyxml 用于解析 myxml 文件，最终形成渲染函数。
* walkMycss 用于解析 mycss 文件。

```js
/* 读取 app.js 内容 */
function walkAppJs(){
    const code = fs.readFileSync(readPath + 'app.js','utf-8')
    return jsTransfrom(code)
}
```

用于 walkAppJs 解析 app.js。装载 app 。最后调用 codeContext.pushCode(`handleJS(null,app.bind(null,pages))`) 运行整个应用。

上面反复用到了一个方法，就是 codeContext , 它就是一个把代码的字符串拼接的类。具体实现如下：

```js
class CodeContext {
    constructor(){
        /* 记录生成的 code 代码 */
        this.code = ''
        this.indentLevel = 2 /* 代码缩进两个字符 */
    }
    /* 拼接目标 */
    pushCode(code){
        this.code += code
    }
    /* 换行 */
    newLine(){
        this.pushCode("
" + `  `.repeat(this.indentLevel));
    }
    /* 换行并且缩紧 */
    indent() {
        this.newLine(++this.indentLevel);
    }
    deindent(){
        this.newLine(--this.indentLevel);
    }
}
module.exports = CodeContext
```

接下来就是 walkMyxml， walkMycss， walkJS 的实现。

```js
/* 解析 myxml */
function walkMyxml(pagePath){
    const path = readPath + pagePath + myxmlNotion
    const isExists = fs.existsSync(path)
    if(!isExists) return ''
    const code = fs.readFileSync(path,'utf-8')
    const ast = myxmlParse(code)
    return myxmlTransfrom(ast)
}
/* 解析 mycss */
function walkMycss(pagePath){
    const path = readPath + pagePath + mycssNotion
    const isExists = fs.existsSync(path)
    if(!isExists) return ''
    const code = fs.readFileSync(path,'utf-8')
    return  `${JSON.stringify(code)}` 
}
/* 解析 JS */
function walkJS(pagePath){
    const path = readPath + pagePath + jsNotion
    const isExists = fs.existsSync(path)
    if(!isExists) return ''
    const code = fs.readFileSync(path,'utf-8')
    return jsTransfrom(code)
}
```

* 对于 myxml 的解析，在小册的第十五章已经讲到了。
* 对于 mycss 的解析，直接转译成了字符串。
* 对于 js 的解析，这里重点介绍一下：

```js

const CodeContext = require('../context')

function transfrom(code){
    const context = new CodeContext()
    context.pushCode('function handleJS(Page,App,Component,getCurrentPages,mydsl){')
    context.indent()
    context.pushCode(code)
    context.indent()
    context.pushCode('}')
    return context.code
}
module.exports = transfrom 
```

对于 js 处理需要通过 handleJS 包装一层。可能有的读者不明白，举一个例子：

![WechatIMG36843.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e163d29dfd8141aa92e0115678eb0c40~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1114&h=642&s=118348&e=png&b=1c1c1c)

如上 js 中的 Page，mydsl 本质上运行时的上下文中并没有这些变量，如上的 js 文件，整体会被编译到 handleJS 内部，handleJS 函数参数里面有 `Page,App,Component,getCurrentPages,mydsl` 等，所以小程序文件中，才可以用 Page, mydsl 等变量。微信小程序的实现原理也是如此。

接下来在终端运行编译文件 node index。

编译产物如下：

```js
const pages = [
  {
    path: 'page/home/index',
    js: function handleJS(Page, App, Component, getCurrentPages, mydsl) {


      Page({
        data: {
          name: 'Alien',
          image: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg',
          myImage: 'https://p9-passport.byteacctimg.com/img/user-avatar/67ae50d1ec26c12c2ab04bc8ab52bd5f~80x80.awebp'
        },
        onLoad: function (options) {
          // 生命周期函数--监听页面加载
          console.log(mydsl.navigateTo)
        },
        onReady() {
          console.log('页面初始化完成=======>')
        },
        onShow: function () {
          // 生命周期函数--监听页面显示
        },
        onHide: function () {
          // 生命周期函数--监听页面隐藏
        },
        handleClick() {
          console.log('点击事件')
          this.setData({
            name: '我不是外星人'
          })
        },
        handleRouterGo() {
          mydsl.navigateTo({ url: 'page/test/index' })
        }
      })
    },
    render: function (context) {
      return [context.createNode("view", {
        "props": {}
      }, function (context) {
        return [context.createNode("bottom", {
          "props": {}
        }, function (context) {
          return ["点击"
          ]
        })
        ]
      })
      ]
    },
    css: "内部过多不再展示"
  },
  {
    path: 'page/test/index',
    js: function handleJS(Page, App, Component, getCurrentPages, mydsl) {


      Page({})
    },
    render: function (context) {
      return [context.createNode("view", {
        "props": {}
      }, function (context) {
        return [context.createNode("view", {
          "props": {}
        }, function (context) {
          return ["测试页面"
          ]
        })
        ]
      })
      ]
    },
    css: ".test{
    color:red;
}"
  }
]
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

如上可以看到 page 页面最后变成的 pages 数组结构，myxml mycss, js 最后的样子。代码最后，引入基础库，执行逻辑层代码。整个小程序就可以运行起来了。

![WechatIMG36850.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b973945d31249de974638c9af1e4147~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1360&h=508&s=52435&e=png&b=ffffff)

![1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8851259a71594101add568f713a217d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.gif#?w=690&h=388&s=1075520&e=gif&f=50&b=1c1c1c)

**待完善点：**

* 1 对于小程序 myxml 一些指令，比如 wx:if wx:for 还没有实现。
* 2 对于 wxs 等文件，暂时没有处理。
* 3 对于 mycss 并没有额外处理。只是解析成了字符串。

## 四 总结

本章节介绍了小程序 dsl 应用的工程化模拟及编译层实现，在下一章节中，将重点介绍初始化，以及和渲染层是怎么通信的。