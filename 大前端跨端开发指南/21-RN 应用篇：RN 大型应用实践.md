## 前言

在前面的章节中，从 JS 运行时，通信角度，渲染角度介绍了 RN 的原理，在本章节和下一章，我将介绍 RN 的应用实践。本章节将从如下维度去全方位介绍 RN 的应用实践。

* 初始化设计： bundle 设计；
* 项目工程设计： 文件目录设计，公共组件设计；
* 组件设计：函数组件，类组件选择；
* 状态管理方案设计 状态管理工具设计；
* 异常监控处理：异常监控设计，JS 异常设计；

## 初始化 bundle 设计

**RN 应用类型**

RN 应用在市面上，按照动态化类型应用，基本上分成两种，第一种就是**全 RN 应用**，说白了就是 Native 提供了一个外壳和基础基建能力，里面的页面都是 RN 动态化页面。这种 RN 应用因为整体都是动态化的，适合一些初创性业务应用。

第二种类型就是混合 RN 应用，这种类型的应用一般核心页面还是 Native 开发的，RN 可以作为核心页面动态化的一部分，或者是核心页面的二级页面。这种方式通俗点说就是采用 Native + RN + 一些其他动态化方案构成的移动端应用。有很多我们耳熟能详的大型 App 都是采用这种方式的。

**RN 业务类型**

对于 RN 应用也是有业务类型划分的，一般情况下都是 ToC 或者 ToB 的。 ToC 应用对于性能的要求更好一些，比如更快的加载速度，秒开率等，都是考核性能的指标。

**RN bundle 方式**

RN bundle 模式可以分为单 bundle 模式和多 bundle 模式。

单 bundle 顾名思义，就是一个 RN 应用，包括应用的基建，组件库就是一个 bundle。 这样 Native 应用只需要维护一个 bundle 就可以了 , 这个 bundle ，可以拆分成多个页面，通过 Navigater 来控制页面路由栈，包括路由跳转等, 当 Native 启动这个 bundle 的时候，所有页面共享同一个 JS 上下文。 ![2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f43193948d341799bd7320677561735~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=696&h=766&s=200607&e=png&b=f2d7b9)

* 优点：单 bundle 方式优点就是方便维护，和传统的 web 应用类似，包括 Native 加载 bundle 也会相对简单，并且可以共享数据状态，让数据管理和通信变得简单。
* 缺点：单 bundle 缺点也比较明显，因为很多页面都是在同一个 bundle 中, 在迭代过程中，会让 JS 文件变得越来越大，那么 Native 下载和加载 bundle 文件时间也就越来越长。这样就会造成加载时间过长，影响用户体验。
* 适合场景：单 bundle 适合业务和功能比较单一的 RN 应用，并且每一个页面逻辑紧凑。比较适合小型应用，初创性需要快速验证的应用。

多 bundle 模式指的是对于 Native 来说，存在多个 RN 应用，每一个 JS bundle 都是相互隔离的，不能共享状态。这样 RN 页面之间的通信就必须通过 Native 中间层来实现。

![3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9d7ac9b5860140199e744f4ab519f9e7~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1054&h=932&s=300258&e=png&b=ffffff)

* 优点：多 bundle 方式可以让每一个 bundle 体积不是很大，Native 加载时间会变小，而且可以针对每一个 bundle 独立上线，重点可以做到**业务隔离**。不同业务线可以加载不同的 bundle。
* 缺点：多 bundle 方式维护起来比较复杂，举一个例子，比如下图业务线中存在两个 bundle ，分别是 bundle1 和 bundle2 ,但是他们有共同的基建 common 和共同的组件库 commonComponent ，如果我们想升级基建或者是组件库，需要把 bundle1 和 bundle2 两个 bundle 都发布一遍。还有一点就是 bundle 和 bundle 之间是不能够直接通信的。

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d73d45ddd88440fab073e567f5855291~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=328&h=180&s=16222&e=png&b=252526)

* 适合场景: 多个 bundle 方式比较适合大型的 App, 存在多个业务线或者同一个业务线多场景的情况，这样可以根据业务场景，拆分成多种类型的 bundle 组合。举一个场景。

![4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d466a9a40ca418bbb981fcb1374d787~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1166&h=844&s=238076&e=png&b=ffffff)

在大型应用实践中，可以具体情况具体分析，如上当 App 有两个业务入口 1 和 2, 两个入口加载不同的业务模块，那么会加载不同的 bundle, 然后在页面 A 中有几个关联密切的上下游页面，那么这几个页面可以用一个 bundle 处理。

**RN bundle 加载**

对于 RN bundle 的加载，也可以采用预加载的方案来提升性能，具体预加载的策略，需要根据业务场景来分析，比如有一个商品列表页面，而商品详情页是 RN 页面，那么进入商品列表的时候，就可以通过预加载方式，加载商品详情页的 bundle 。

## 项目工程设计

以大型 RN 项目为例子，看一下 RN 的项目的工程上应该怎么设计，对于大型的 RN 应用来说，一般都采用多 bundle 模式，在整个工程中，可以存在多个页面的 bundle，整个基建层，以及公共的组件层。 整个项目结构如下所示：

```js
src
│   common -> 存放 RN 的公共基建层
│   components -> 存放公共组件
│   utils  -> 存放工具函数
└───bundle1 -> 第一个 bundle 应用
│   │   assets -> 存放静态文件
│   │   components -> 存放公共组件
│   │   modal -> 存放公共状态
│   │   service  -> 存放请求数据
│   │   page -> 存放页面结构
│   │   styles -> 存放样式文件
│   │   app.js -> bundle 入口文件
└───bundle2 -> 第二个 bundle 应用
    │   ....
```

如上每一个 bundle 都可以作为一个独立的应用层，里面有完整的应用结构，包括静态文件，组件集合，公共状态，页面等。不同的 bundle 享用同样的基建层 common，组件层 components 和工具层 utils，当然也可以把它们上传都 npm 包管理工具。

这些 bundle 都可以独立发布，发布一个 bundle 之后，Native 端会通过对比新老版本号来确定是否是最新的 bundle，然后加载最新的 bundle。这样也会有一个弊端，上面说到了，如果想要升级基建或者公共组件，需要把所有的 bundle 都发布一遍。

## 组件设计

在 RN 应用中，在 JS 运行时中主要构建的是虚拟 DOM 树，组件做了构建 DOM 树的重要一环，在 RN 应用，核心就是**组件**。

**函数组件 or 类组件**

在 RN 中的函数组件和类组件，应该如何选择呢？接下来我们分析一下场景。

类组件存在完成生命周期，并且可以更方便的保存状态，更新状态。

```js
import { DeviceEventEmitter } from 'react-native';
class Index extends React.Component{
    /* constructor 可以做一些初始化的操作，初始化状态，解析 scheme 参数 */
    constructor(props) {
        super(props)
        this.state = {}
    }
    /* 在组件渲染之前执行，可以用来绑定事件 */
    componentWillMount() {
        /* 绑定页面展示事件 */
        this.appearInstance = DeviceEventEmitter.addListener('containerAppear',()=>{})
        /* 绑定页面隐藏事件 */
        this.disAppearInstance = DeviceEventEmitter.addListener('containerDisAppear',()=>{})
    }
    /* 页面渲染之后，通常在该方法中完成异步网络请求。 */
    componentDidMount() {}
    
    /* 当父组件更新的时候，会触发 componentWillReceiveProps  */
    componentWillReceiveProps(nextProps) {
        this.setState({ ... });
    }
    
    /* 组件更新时候，用于判断组件是否更新，返回 true 更新组件，返回 false 不更新组件。 */
    shouldComponentUpdate(nextProps, nextState){}
    /* 组件更新完毕后执行 */
    componentDidUpdate(preProps, preState) {
        /* 可以用来获取最新的状态 */
    }
    /* 组件卸载的时候执行 */
    componentWillUnmount() {
        /* 解绑事件 */
        this.appearInstance.remove() 
        this.disAppearInstance.remove() 
    }
    /* 用于捕获渲染异常 */
    componentDidCatch(){}
}
```

对于 React Native 来说, Native 向 RN 传递的参数，一般采用 scheme 传递的方式，在 RN 会被处理成 props, 所以开发者可以在 constructor 获取 Native 容器提供的参数，并且可以做一些初始化的操作。

对于移动端应用来说，除了常规的生命周期之外，还有两个非常重要的生命周期，就是页面的展示和隐藏，比如 App 切入到后台，那么会执行隐藏事件，然后从后台再切回前台，会执行展示事件。那么这个时候需要通过 DeviceEventEmitter 来绑定事件，对于事件的绑定可以在 componentWillMount 中执行，这个生命周期在组件渲染之前执行。

在 RN 应用中需要请求数据，渲染服务端数据，开发者可以在 componentDidMount 中请求数据，渲染数据。如果当前组件有父组件，父组件发生了更新，那么会触发组件的 componentWillReceiveProps 生命周期。

因为 RN 应用的渲染原理和 Web 更新复杂，需要把渲染指令传递到 Native 端，所以通信成本比较高，所以减少 RN 的渲染次数就比较重要了，在 RN 中可以多利用 shouldComponentUpdate 生命周期来限制组件不必要的更新，提升 RN 的整体性能。在组件更新之后会执行 componentDidUpdate ，开发者可以获取更新后的视图元素信息。

在 React 的 componentWillUnmount 生命周期中，可以用来清除一些定时器，延时器，清除一些事件监听器，可以有效的防止内存泄漏的现象。

因为类组件有一个实例，可以保存状态，这样对于开发者来说更方便，没有那么多心智负担。并且在 RN 中在类组件中使用一些 React Native 组件会比较方便。

```js
<FlatList
    ...
    onViewableItemsChanged={this.handleItemChanged}
/>
```

如上用高性能列表组件 FlatList 时候，可以直接绑定 onViewableItemsChanged 为 handleItemChanged 函数。但是如果在函数组件中，如果如下写法：

```js
const handleItemChanged = () =>{}
<FlatList
    ...
    onViewableItemsChanged={handleItemChanged}
/>
```

这样在 RN 中可能会爆出这样的错误 `XXX on the fly is not supported` ，这些是底层报出来的问题，解决这个问题很简单，只需要把 handleItemChanged 用 useCallback 处理，如下所示，但是这可能会给开发者带来一些解决问题的成本。

```js
const handleItemChanged = React.useCallback(()=>{},[])
```

言归正传，在 RN 中，函数组件是笔者比较推荐的，因为函数组件可以通过 hooks 解耦逻辑，抽离成自定义 hooks 也能做到逻辑复用。函数组件可以通过 useState 和 useReducer 触发更新。可以通过 useEffect 和 useLayoutEffect 来弥补函数组件没有生命周期的缺陷。如下：

```js
useEffect(()=>{
    // 请求数据
    // 绑定事件
    return function (){
       // 解决绑定
       // 清除定时器
    }
},[])
```

那么在 RN 应用中，合理的搭配使用类组件和函数组件，能达到更好的效果，比如可以利用函数组件的逻辑抽离，类组件的异常捕获等等。并且要结合团队内部开发者的能力水平，如果团队新手比较多，那么传统的类组件处理比较复杂的组件，是一个很稳健的选择。

## 通信方案设计

**状态管理工具**

在 RN 应用中，对于同一个 bundle 下面的页面，可以有状态管理工具。比如 redux 或者 mobx 等。 状态管理工具可以解决跨组件间的状态通信，接下来我们以 Redux 为例子，看一下 redux 配置流程：

编写 reducer: 首先写一个 reducer ，reducer 是由 dispatch 触发的，数据经过 reduce 之后，可以得到最新的 state，触发更新。

```js
/* number Reducer */
function numberReducer(state=1,action){
  switch (action.type){
    case 'ADD':
      return state + 1
    case 'DEL':
      return state - 1
    default:
      return state
  } 
}
```

有了 reducer, 接下来就可以注册 reducer，形成 store 。

```js
/* 注册reducer */
const rootReducer = combineReducers({ number:numberReducer,info:InfoReducer  })
/* 合成Store，number = 1 为 初始化值 */
const Store = createStore(rootReducer,{ number:1 }) 
```

接下来，可以在想要订阅 store 数据的地方，通过 Store.subscribe 进行订阅，如下：

```js
function Index(){
  const [ state , changeState  ] = useState(Store.getState())
  useEffect(()=>{
    /* 订阅state */
    const unSubscribe = Store.subscribe(()=>{
         changeState(Store.getState())
     })
    /* 解除订阅 */
     return () => unSubscribe()
  },[])
  /* 处理点击事件 */
  const handleClickAdd = ()=>{
      Store.dispatch({ type:'ADD' }) // number + 1
  }
  return <View>
      <Text>{ state.number }</Text>
      <TouchableOpacity onPress={handleClickAdd} >
         <Text>number + 1</Text>
      </TouchableOpacity>
  </View>
}
```

如上就是通过 redux 实现更新的流程，在 useEffect, 通过 Store.subscribe 进行订阅状态，然后通过 Store.dispatch 触发 reducer ，reducer 之中改变 state ，然后触发 subscribe 回调函数，在回调函数中，改变组件的 state, 完成整体更新。

如上就是通过 redux 完成状态管理的流程。对于一些比较简单的页面，也可以采用 EventBus 等状态通信方案。

## 异常处理

在 RN 中，有一些关键节点的错误是需要开发者关注的，比如渲染异常，接口请求异常，这种错误一般会影响页面正常展示。

**JS 异常处理**

一些核心节点需要通过 try{}catch{} 处理，类似如下场景：

```js
try{
    await getSourceData()
}catch(e){
    /* 捕获到请求的异常，或者其他错误 */
    /* 上报错误，异常处理 */
}
```

如上通过 try 捕获请求过程中出现的异常。

**渲染错误兜底**

在 RN 应用中，如果出现渲染异常的话，那么会是一个很致命的问题，如果发生错误在页面维度的组件上，那么会让整个页面白屏，所以解决这个问题，需要对容器出现渲染异常的组件，统一做兜底处理和监控。这个时候，就需要一个 RenderError 组件包裹业务组件。 如下所示：

```js
import React, { createElement } from 'react'
import { Dimensions } from 'react-native'

class RenderError extends React.Component{
    state={
        isError:false
    }
    componentDidCatch(e){
        console.log('出现的错误是：',e)
        // 触发监控，上报错误
        this.setState({ isError:true })
    }
    render(){
        /* 获取容器高度 */
        let {  height } = Dimensions.get('window')
        return !this.state.isError ?
             this.props.children :
             <View style={{...styles.errorBox,height}} >
                 {/* 异常 */}
                 <Image source={require('../../assets/img/net_fail.png')}
                     style={styles.erroImage}
                 />
                 <Text style={styles.errorText}  >页面错误，请稍后重试</JDText>
             </View>
    }
}

/* 使用异常兜底 */
function Index(props){
    return <RenderError>
       <Home {...props} />
    </RenderError>
}
```

如上，RenderError 中通过 componentDidCatch 捕获渲染中的异常，如果出现异常，那么做 UI 降级处理，渲染异常兜底图片，并触发报警，上报异常。

## 总结

本章节通过多个角度介绍了 RN 大型应用实践，在下一章节中我们将介绍 RN 的设计模式。