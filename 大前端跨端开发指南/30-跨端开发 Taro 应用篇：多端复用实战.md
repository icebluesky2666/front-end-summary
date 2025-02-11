## 一 前言

Taro 是跨端开发的经典解决方案，可以支持使用 React/Vue/Nerv 等框架，运行小程序和 H5 应用。有了 Taro, 前端开发同学，可以使用自己擅长的框架，跨端开发 h5 小程序。接下来让我们看一下如何快速上手 Taro 框架。

**快速上手：**

首先就是安装 Taro 的脚手架 @tarojs/cli，在终端执行命令：

```js
 npm install -g @tarojs/cli
```

成功之后会如下的样子：

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2690d5257db34bb8bfa64c5e070fd731~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1124&h=332&s=276629&e=png&b=1f1f1f)

成功之后可以运行 `taro -v` 可以看到 taro 脚手架是否安装成功了。

![10.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78cb26d968a041bcbeae678cc4adbfc8~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=676&h=186&s=60010&e=png&b=1f1f1f)

接下来就可以通过 `taro init myApp` 来初始化项目。

![2.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed901b2012974c48aba0269e711c68bc~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1236&h=624&s=121793&e=png&b=1e1e1e)

如上可以选择项目的配置，在运行时框架上，可以选择 Vue，Vue3 和 React 等; 在语言层面上可以选择 TypeScript 或者 JavaScript；还可以自由的选择 CSS 预处理器，编译工具和包管理工具等。

选择完工程化配置后，接下来 Taro 可以自定义从远程下载模版，然后自动安装依赖，接下来项目初始化完成了：
![3.jpeg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd5a3820f58f42f7805662dba913c430~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=330&h=612&s=45519&e=jpg&b=272729)

接下来可以运行不同的终端命令，构建不同端的产物。来看一下 myApp 工程项目中的 package.json 文件，里面存在各种的命令，比如运行 h5 端，小程序端，React Native 端。

![4.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c8a9140913d844b68a699bc768411841~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1008&h=760&s=183176&e=png&b=1e1e1e)

如果我们想把代码运行到 h5 端，那么终端执行 npm run build:h5 ，这样会把我们的业务代码打包到 dist 文件夹下面，打包产物如下所示：
![5.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e86080779d964260b75064cb62011a63~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=284&h=276&s=18311&e=png&b=252526)

如上可以打包的产物都是浏览器 html js ,css 三大件这一套。

如果想运行到小程序端，那么只需要终端运行 npm run build:weapp, 接下来就可以看到产物了。
![6.jpeg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cfda8319dd243aa9285b256b599eaea~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=318&h=704&s=46070&e=jpg&b=252527)

这样就可以实现，一套代码可以运行多端，真正的实现了跨端多端复用了。 接下来我们用 React 构建的 H5 引用，和 Vue 构建的小程序应用为切入点，详细介绍一下 Taro 应用实践。

## 二 Taro React 构建 H5 应用

**Taro 构建 H5 的应用适合什么场景？**

Taro 构建 H5 应用，非常适合 App 应用内部嵌入的 h5 活动页面，或者本身是 h5 构建的移动 端 Hybrid 应用。

作者之前在某家大厂，用 Taro 构建了一个 h5 应用，主要场景就是某一个知名电商 App 内部的 h5 落地页。

Taro 构建 h5 优势是十分明显的，Taro 本身做了移动端适配，无需开发者在关心适配成本，并且 Taro 生态体系比较完善，比如移动端的 UI 库有 taro-ui，里面提供了很多移动端组件。比如，移动端网页期望更快的打开速度，那么就需要 SSR 服务端渲染，提升首屏实现，那么可以用 Taro 配套的 SSR 服务端渲染方案—[tarojs-plugin-ssr](https://github.com/NervJS/tarojs-plugin-ssr "https://github.com/NervJS/tarojs-plugin-ssr") 。

**应用入口：**

接下来我们用 React 构建一个 h5 应用，选择 ts 开发，并且使用 mobx 作为状态管理工具：

```ts
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'

import Index from './pages/index'
import eventListener from './store/eventListener'
import './app.less'

const store = {
  eventListener
}

class App extends Component {
  constructor(){
    super()
  } 
  componentDidMount(){
    /* 可以获取路由信息，比如路由 path 和路由参数等 */
    const { path } = this.$router as any
    console.log(path)
  }
  /* 这里约定配置路由页面 */
  config: Config = {
    pages: [
      'pages/index', //首页
      'pages/fail',  //失败页面
    ],
  }
  render () {
    return (
      /* 使用 mobx  */
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}
/* Taro 提供的渲染器 */
Taro.render(<App />, document.getElementById('app'))
```

如上用 Taro 提供的 render 渲染器来负责视图渲染，config 里面约定好路由页面，这个应用有首页和失败页两个页面 ，@tarojs/mobx 能够让 Taro React 使用 mobx 进行状态管理。

可以在 $router 中可以获取路由信息。在 Taro v3.6 版本中，运行时引入 History & Location 对象，且尽可能与 Web 端规范对齐，你可以在 window 对象上访问到 history 和 location 对象。同时，也支持监听 hashchange 和 popstate 事件，这为使用路由库提供技术基础。

**使用 DOM Api**

在 Taro h5 应用中，有一点比较好的就是有 DOM 以及对应的 API , 所以可以使用一些基于 DOM 的操作，比如获取元素真实 DOM ，或者 DOM 事件监听等。

```js
 useEffect(()=>{ 
    document.addEventListener('scroll', handerScroll)
    return function () {
        document.removeEventListener('scroll', handerScroll)
    }
},[])
```

如上在可以用 hooks 和事件监听器完成滚动事件的监听。

**与 app 完成协议通信**

在 Taro h5 本质上运行在 Native 的 webview 容器里，所以会有很多安卓和 ios 差异，可以读取 `navigator.userAgent` 中的设备状态，根据不同的端做不同的处理。

对于一些和 Native 简单交互，比如跳转，返回，刷新，可以按照容器 App 指定的 scheme 协议处理，如果有差异，就可以走差异化逻辑。

```js
const browerEnv = (window as any).__browerEnv__ 
if(browerEnv==='IOS'){
    window.location.href = "openApp://webview?refresh=true";
}else{
    window.location.href = 'openApp.Mobile://virtual?params={"category":"jump","des":"HomePage","sourceValue":"","sourceType":""}'
}
```

如上用 `window.location.href` 来完成大多数交互逻辑。还可以通过之前第三章中讲到的桥通信来解决与 Native 的交互问题。

**工程化配置**

在 Taro 项目中，可以在根目录中的 config 文件中，做不同环境下配置环境，如下所示：
![7.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebf83b92e3bb4a59bbc6951c6f6c8307~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=412&h=750&s=67231&e=png&b=262627)

如上 index.js 中是 Taro 工程化的公共配置，dev.js 是在本地调试环境下的配置文件，prod.js 是生产环境下的配置文件。

```js
module.exports = {
  env: {
    NODE_ENV: '"development"' // 当前环境参数
  },
  defineConstants: {
  },
  weapp: {}, // 微信环境下的配置
  h5: {  // h5 环境下的配置
    devServer:{
      host:'localhost',
      port:10086,
      historyApiFallback: true,
      inline: true,
      publicPath: '/',
      proxy:{ // 配置本地服务器代理
        '/':{
          target:'https://xxx.xxx.com',
          changeOrigin:true,
        }
      }
    },
  }
}
```

如上在 `module.exports` 导出的对象中，h5 属性代表 h5 环境下的配置，weapp 代表微信环境下的配置，如上本地化配置中，可以通过配置 proxy 来完成本地服务器代理，解决本地调试跨域问题。

**设计模式应用**

用 Taro React 构建的 h5 应用，可以灵活运用 React 多种设计模式，比如组合模式，Hoc 高阶组件模式，自定义 Hooks 模式 , render props 等方式，通过这些设计模式，可以提升项目的架构能力，增加代码健壮性和可维护性。

## 三 Taro Vue 构建小程序应用

讲完 Taro 构建 web 应用，我们来看一下用 Taro Vue 构建一个小程序应用，Taro 有 2.0 升到了 3.0， 对于小程序的处理，由轻运行时重编译时变成了轻编译时重运行时，新版本 Taro 小程序更多的是保存了原生框架的活性，比如 Vue 中的响应式，React 的 Reconciler 渲染器，这些都是在运行时执行的，也就又可能会带来一些性能负担。但是在运行时和编译时之间寻找均衡点，可能也是这种跨端框架发展的一项重要指标。

**入口文件**

来看一下 Vue 构建的小程序的入口文件。
![8.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31654fbc4d9a41abaa2940a59f3b3e96~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=268&h=572&s=42472&e=png&b=252526)

```js
import Vue from 'vue';
import Taro from '@tarojs/taro'
import store from './store';
import './app.scss';
import navCustomBar from './components/xl-nav-bar';
import XlPicker from './components/xl-picker';
/* 使用程序的虚拟列表 */
import VirtualList from '@tarojs/components/virtual-list'

/* 注册小程序的公共组件 */
Vue.use(VirtualList)
Vue.component('xl-picker', XlPicker);
Vue.component('nav-custom-bar', navCustomBar);

/* 这里可以做一些初始化的事情 */

const App = new Vue({
  store, // 使用状态管理工具
  onShow(options) { // 小程序生命周期
    console.log('----App onShow');
  },
  onLaunch() {
    console.log('----App Launch');
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default);
  },
});

export default App;
```

Vue 构建的小程序应用，和 Vue web 应用类似，在入口文件中，可以完成公共组件的注册，比如可以使用 Taro 小程序的虚拟列表组件 VirtualList ,还可以做一些初始化的事情，比如  
1 初始化一些状态，比如环境变量，请求参数等；  
2 判断小程序是否有新版本；  
3 业务处理；

在 Vue 的实例化过程中，有小程序特有的生命周期，比如 onShow ，onLaunch 等，还可以注册状态管理工具，比如 Vuex 。

**Taro 和原生小程序结合**

taro 小程序本质上用的 React 或者 Vue 语法，小程序用的是独有的语法，在 Taro 小程序中，可以使用原生小程序和 taro 小程序混合开发的模式。比如在 Taro 构建的 Vue 小程序中使用小程序原生的 tab 组件。如下所示：
![9.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be7efffaf6d64bbebcbcfaca45bfe04c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=342&h=736&s=58293&e=png&b=272728)

但是会暴露一个问题，就是如何实现原生小程序和 Taro Vue 小程序的通信呢？这里交给大家一个方法，可以用 EventBus 来解决，就可以实现 Taro 小程序和原生小程序的通信了。比如

```js
attached() {
   /* 绑定方法 */ 
   BusService.on("getMenuList", this.changeData.bind(this), false);
},
methods:{
    changeData(tabbar) {}
}
```

如上通过 EventBus 绑定了一个 getMenuList 的事件，绑定的方法是小程序的 changeData 方法。这样绑定之后，就可以在 Taro Vue 小程序中使用触发 getMenuList 事件。

```js
<template>
</template>
<script>
export default {
    onLoad(options, e) {
        /* 触发 EventBus 中的 getMenuList  */
        BusService.emit('getMenuList',this.menuList)
    }
}
</script>
```

如上在 vue 文件中，在 onLoad 中触发 getMenuList 方法，实现了原生小程序 -> Taro 小程序的通信。

**请求封装**

在 Taro 小程序中，默认使用了 Taro.request 的固定方法，这个方法底层使用 wx.request 方法，但是对比 axios 等请求库，wx.request 很多功能都缺失，比如请求拦截，响应拦截等，所以可以封装一些请求方法，补上一些核心功能。

```js
import Taro from '@tarojs/taro'
import { compose } from "../base/utils/index";
import { commonPath } from "./common-url";

const requestInterceptorQueue = []; /* 请求拦截器数组 */
const responseInterceptorQueue = []; /* 响应拦截器 */

const request = Taro.request;

export const interceptorsRequest = {
  use: (cb) => {
    const symBolKey = Symbol("");
    cb.interceptorslKey = symBolKey;
    requestInterceptorQueue.push(cb);
    return symBolKey;
  },
  eject: (symBolKey) => {
    const index = requestInterceptorQueue.findIndex(
      (item) => item.interceptorslKey === symBolKey
    );
    if (index >= 0) requestInterceptorQueue.splice(index, 1);
  },
};
/* 封装响应拦截器 */
export const interceptorsResponse = {
  use: (cb) => {
    const symBolKey = Symbol("");
    cb.interceptorslKey = symBolKey;
    responseInterceptorQueue.push(cb);
    return symBolKey;
  },
  eject: (symBolKey) => {
    const index = responseInterceptorQueue.findIndex(
      (item) => item.interceptorslKey === symBolKey
    );
    if (index >= 0) responseInterceptorQueue.splice(index, 1);
  },
};
/**
 * @param res 请求成功响应内容
 * @param hander 处理函数resolve
 */
function proxyResole(res, handleResolve, handleReject) {
  const newRes = compose(responseInterceptorQueue, res);
  handleResolve(newRes);
}

/**
 * @param err 请求失败
 * @param hander reject
 */
function proxyReject(err, handleReject) {
  handleReject();
}

/**
 * @param param 请求
 */
export function httpRequset(param) {
  const newParam = compose(requestInterceptorQueue, param);
  const url = `${commonPath}${param.url}`;
  return new Promise((resole, reject) => {
    request({
      ...newParam,
      url,
      success: (res) => proxyResole(res, resole, reject),
      fail: (err) => proxyReject(err, reject),
    });
  });
}

/**
 * @param method 请求方法
 */
function httpFactory(method) {
  return function (options) {
    return httpRequset({
      method,
      ...options,
    });
  };
}

export const get = httpFactory("get");
export const post = httpFactory("post");

export default httpFactory;
```

如上就是请求库的封装，这些统一处理的响应成功，和响应失败的场景，对于响应失败的情况，也可以集中处理。这样业务就可以直接使用：

```js
function getScreenConfigQuery(data){
    return new Promise((resolve,reject)=>{
        get(commonUrl + '/screen/config/query',resolve,data, reject ) // 使用 get 方法
    })
}
```

当然也可以使用请求拦截器：

```js
/* 请求拦截 */
interceptorsRequest.use((req) => {
  const { header = {} } = req;
  const token = wx.getStorageSync("token");
  req.header = {
    ...header,
    Authorization: `Bearer ${token}`,
  };
  return req;
});
```

如上通过自定封装的请求拦截器，将 token 注入到请求头中。

## 四 总结

本章节介绍了 Taro 应用的上手，从 h5 和小程序两个角度介绍了 Taro 的应用，感兴趣的读者可以尝试用 Taro 构建一个 web 或者小程序应用，“纸上得来终觉浅,绝知此事要躬行” 只有尝试了，才会有更深刻的收获。

在下一章节中，我将介绍 Taro 背后的运转原理。