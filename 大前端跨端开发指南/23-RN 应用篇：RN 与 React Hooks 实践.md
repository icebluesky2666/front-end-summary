在前面的章节中，介绍了 React 应用实践，本章节讲介绍 React Hooks 在 React Native 中的应用实践，通过本章节的学习，将收获以下内容：

* Hooks 在 RN 中的应用。
* RN 中时如何设计自定义 Hooks 的。
* 自定义 Hooks 实践。

## 二 React Hooks 介绍

React Hooks 已经是一个老生常谈的话题了，它增加代码的可复用性，逻辑性，弥补无状态组件没有生命周期，没有数据管理状态state的缺陷。值得高兴的事是 RN 中也支持了 React Hooks ，这里对比了一下在 RN 中 React Hooks 的支持程度，在 React v17 以下的版本中，React Native 是完全可以像 web 应用一样使用 Hooks 的，但是 RN 不能使用 React v18 中相应的 hooks。

在 RN 中的 Hooks 也基本可以分为**数据更新驱动型**，**执行副作用型**，**状态获取与传递型** ，**状态的派生与保存**， 下面就分别介绍一下在 RN 中常用 React Hooks 的基本使用。

### 2.1 数据更新驱动型

负责更新驱动的就是 useState 和 useReducer, 其中最为常见的就是 useState。

这里说一句题外话，本质上 useReducer 内层实现和 useState 是差不多的。useReducer 在 useState 基础上，增加了聚合 reducer 的概念，就是可以通过每一个 dispatch 触发一个更新指令，更新指令都会在 useReducer 的第二个函数中执行，根据更新的类型和更新的数据，来触发不同状态的更新，而 useState 一般情况下负责单一性状态的更新。

以 useState 为例子, 接下来看一下 useState 的基本使用：

**useState 基础介绍：**

```js
const [ ①state , ②dispatch ] = useState(③initData)
```

① state，目的提供给 UI ，作为渲染视图的数据源。

② dispatchAction 改变 state 的函数，可以理解为推动函数组件渲染的渲染函数。

③ initData 有两种情况，第一种情况是非函数，将作为 state 初始化的值。 第二种情况是函数，函数的返回值作为 useState 初始化的值。

例子如下所示：

```js
import { View, Text , TouchableOpacity } from 'react-native
import { useState } from 'react'

function Demo (){
    const [ number, setNumber ] = useState(0)
    const handleClickAdd = () => {
        setNumber(number + 1)
        console.log(number) // 不能访问最新的 number 值
    }
    return <TouchableOpacity onPress={handleClickAdd} >
        <View >
           <Text>{ number }</Text>
        </View>
    </TouchableOpacity> 
}
```

在 React Native 中点击事件需要用特有的 TouchableOpacity 组件，文本需要用 Text 组件。

通过 setNumber 改变最新的 state , 在同样是上下文中是获取不到最新值的，如上在 handleClickAdd 中，打印 number 的值还是之前的值。只有在函数组件下一次更新的时候，才能访问到最近的 state 。

### 2.2 执行副作用型

React hooks 也提供了 api ，用于弥补函数组件没有生命周期的缺陷。其本质主要是运用了 hooks 里面的 useEffect ， useLayoutEffect，其中最常用的就是 useEffect 。首先来看一下 useEffect 的使用：

```js
useEffect(()=>{
    return destory
},dep)
```

useEffect 第一个参数 callback, 返回的 `destory` ， destory 作为下一次callback执行之前调用，用于清除上一次 callback 产生的副作用。

第二个参数作为依赖项，是一个数组，可以有多个依赖项，依赖项改变，执行上一次callback 返回的 destory ，和执行新的 effect 第一个参数 callback 。

在 RN 中, useEffect 的实现和 web 中是如出一撤的。对于每一个 effect 的 callback，通过 `Schedule` 调度模块，将回调函数放入调度中去执行，在调度中的处理， 和 setTimeout 回调函数一样，放入任务队列，等到主线程任务完成，视图元素更新完毕，js 执行完成，视图绘制完毕，才执行。 所以 effect 回调函数不会阻塞视图的正常绘制。

当然对于 useEffect 的孪生兄弟 `useLayoutEffect` 中，在 RN 中是同样支持的。useLayoutEffect 的执行时机，对标了类组件的 componentDidMount 和 componentDidUpdate 的时机是一致的。

但是对于 Effect 的处理, RN 和 web 多多少少会有一些区别。其区别如下：

**RN 中的 Effect 和 Effect 的区别？**

在前面的章节，讲到 RN 中更新本质上是通过 C++ 通信，向 Native 发送渲染指令，然后 Native 进行渲染绘制。这个过程的时间节点，对于 JS 运行时是无法感知到的，这样就会造成一些问题。在 web 端，通过 DOM api 修改元素的时候，本质上浏览器进行着重绘和回流，是可以获取到最新的元素信息，但是在 RN 中，可能获取不到最新的信息，比如在 componentDidUpdate 或者 useLayoutEffect 中通过 UIManager 可能获取不到最新的元素视图信息。那么如何解决这个问题呢？

实际上解决这个问题，也很容易，推荐两个方法。

第一个方法就是用 setTimeout 创建一个短暂的延时，在回调函数中，再去获得最新的元素信息。

```js
setTimeout(()=>{
   // 获取元素信息
},200) // 增加 200 毫秒延时。
```

在 RN 中，视图容器组件中，有对应的回调函数 onLayout ，当视图容器内部布局发生变化的时候，会触发 onLayout 的执行，如下所示。

```js
<View onLayout={()=>{}} >...</View>
```

来看一下在 RN 中 useEffect 能做那些事？

```js
import { useState, useEffect, useRef  } from 'react'
import { DeviceEventEmitter } from 'react-native';

function Demo({ a }){
    const [number, setNumber] = useState(0)
    const element = useRef(null)
    useEffect(()=>{
        /* 请求数据 */
       getUserInfo(a).then(res=>{
           setUserMessage(res)
       })
       /* 定时器 延时器等 */
       const timer = setInterval(()=>console.log(666),1000)
       const listener = DeviceEventEmitter.addListener('通知名称', (message) => {
           /* 进行监听 */    
       })
       console.log(element) /* 打印元素 */
       return function (){
             /* 清除延时器 *//
            clearInterval(timer)
            /* 清除监听器 */ 
            listener.remove()
       }
    // /* 只有当props->a和state->number改变的时候 ,useEffect副作用函数重新执行 ，如果此时数组为空[]，证明函数只有在初始化的时候执行一次相当于componentDidMount */   
    },[ number, a])
    return <View ref={element} />
}
```

如上在 useEffect 中做的功能如下：

* 请求数据。
* 设置定时器,延时器等。
* 通过 ref 获取元素位置信息等内容。
* 可以注册 NativeEventEmitter 。
* 可以清除定时器，延时器，解绑事件监听器等。

### 2.3 状态的获取与传递

在 RN 中也可以通过 context 来传递状态，通过 ref 来获取状态。下面来看一下 useContext 和 useRef 的使用。

**useContext**

可以使用 useContext ，来获取父级组件传递过来的 context 值，这个当前值就是最近的父级组件 Provider 设置的 value 值，useContext 参数一般是由 createContext 方式创建的 ,也可以父级上下文 context 传递的 ( 参数为 context )。useContext 可以代替 context.Consumer 来获取 Provider 中保存的 value 值。

```js
const contextValue = useContext(context)
```

useContext 接受一个参数，一般都是 context 对象，返回值为 context 对象内部保存的 value 值。来看一下 RN 中 useContext 的基本用法：

```js
import { View, } from 'react-native
import { useContext, createContext } from 'react'

const Context = createContext({ name:'我不是外星人' })

// 传递 context 
function ProviderDemo (){
    return <Context.Provider value={{ name:'' , age:18 }} >
            <DemoContext />
            <DemoContext1 />
    </Context.Provider>
}

//使用
const DemoContext = ()=> {
    const value:any = useContext(Context)
    /* my name is alien */
    return <View> 
         <Text> my name is { value.name } </Text>
    </View>
}
```

如上就是 useContext 在 RN 中的传递与使用。

**useRef**

useRef 可以用来获取元素，缓存状态，接受一个状态 initState 作为初始值，返回一个 ref 对象 cur, cur 上有一个 current 属性就是 ref 对象需要获取的内容。

```js
const cur = React.useRef(initState)
console.log(cur.current)
```

在 RN 中 useRef 可以用来保存状态或者是获取元素对应的虚拟节点，具体如下所示：

获取元素节点：

```js
const cur = React.useRef(initState)
return <View ref={cur} ></View>
```

### 2.4 状态的派生与保存

RN 中可以用 useCallback 和 useMemo, 来看一下两者的区别。

**useCallback:**

useCallback 可以把函数变成有‘记忆’功能的，它返回一个函数，如果将这个函数传递给子组件的时候，在对于 props 变化的时候，因为 useCallback 已经把函数缓存起来了，所以在父组件更新的时候，可以通过对比 props 中回调函数是否发生改变，来解决是否更新组件。来看一下基本使用：

```js
function Demo(){
    /* 回调函数 */
    const cb = React.useCallBack(()=>{},[])
    return <ChildrenComponent callback={cb}  />
}
```

在 RN 中，如果使用函数组件，有一些组件的回调函数需要通过 useCallBack 处理，否则会报 `the fly is not supported` 这个错误。

举一个例子在 RN 中， 有几个高性能列表组件 FlatList 和 SectionList ，如果函数组件使用这些组件，对于一些回调函数需要做额外的处理。比如 `onViewableItemsChanged` 在可见行元素变化时，会调用这个方法。

这个方法在函数组件里面，最好用 useCallback 包裹，如下所示：

```js
import { FlatList } from "react-native"
import { useCallback } from 'react'
 
function List(){
    /* 将 onViewableItemsChanged 的回调函数，需要通过 callback 包裹 */
    const handleItemChanged = useCallback(()=>{

    },[])
    return <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onViewableItemsChanged={handleItemChanged}
    />
}
```

如上将 onViewableItemsChanged 的回调函数，需要通过 callback 包裹。

**useMemo:**

useMemo 可以在函数组件 render 上下文中同步执行一个函数逻辑，这个函数的返回值可以作为一个新的状态缓存起来。

useMemo 基础介绍：

```js
const cacheSomething = useMemo(create,deps)
```

* create：第一个参数为一个函数，函数的返回值作为缓存值，如上 demo 中把 Children 对应的 element 对象，缓存起来。
* deps： 第二个参数为一个数组，存放当前 useMemo 的依赖项，在函数组件下一次执行的时候，会对比 deps 依赖项里面的状态，是否有改变，如果有改变重新执行 create ，得到新的缓存值。
* cacheSomething：返回值，执行 create 的返回值。如果 deps 中有依赖项改变，返回的重新执行 create 产生的值，否则取上一次缓存值。

## 三 RN 自定义 Hooks 的设计

RN 中的自定义 Hooks 是如何设计的呢？首先看一下我对自定义 hooks 的理解

自定义 hooks 是在 React Hooks 基础上的一个拓展，可以根据业务需求制定满足业务需要的组合 hooks ，更注重的是逻辑单元。通过业务场景不同，到底需要React Hooks 做什么，怎么样把一段逻辑封装起来，做到复用，这是自定义 hooks 产生的初衷。自定义 hooks 也可以说是 React Hooks 聚合产物，其内部有一个或者多个 React Hooks 组成，用于解决一些复杂逻辑。

一个传统自定义 hooks 长如下的样子：

编写：

```js
function useXXX(参数A,参数B){
    /*  
     ...自定义 hooks 逻辑
     内部应用了其他 React Hooks —— useState | useEffect | useRef ...
    */
    return [xxx,...]
}
```

使用：

```js
const [ xxx , ... ] = useXXX(参数A,参数B...)
```

实际上自定义 Hooks 的编写很简单，开发者只需要关心，传入什么参数（也可以没有参数），和返回什么内容就可以了，当然有一些监听和执行副作用的自定义 Hooks ，根本无需返回值。

在 RN 中自定义 Hooks 虽然不能直接操作 DOM ，或者是 DOM 监听，但是取而代之的可以做一些 RN 中特有的操作。

自定义 Hooks 的设计可以从:

**分析痛点** -> **提取公共逻辑** -> **解决痛点** 来完成。这么说可能一些读者会很懵，接下来通过一个例子来看一下自定义 Hooks 是如何设计的。

RN 本质上是移动端动态化的解决方案，在移动端监听 App 的显示和隐藏是一个非常常见的情况，因为页面显示和隐藏的时候，业务也需要做很多事情，比如埋点的上报等，那么对于移动端 RN 应用来说，就需要增加两个额外的生命周期，来回调页面的显示或者隐藏。

监听页面的显示和隐藏，可以通过 DeviceEventEmitter 来实现，在函数中组件中如下所示：

```js
useEffect(()=>{
    const appear = DeviceEventEmitter.addListener('containerAppear',()=>{
        //监听页面显示
    })
    const disAppear = DeviceEventEmitter.addListener('containerDisAppear',()=>{
        //监听页面隐藏
    })
    return function (){
        appear.remove()
        disAppear.remove()
    }
},[])
```

**分析痛点：**

但是整个 RN 中会有很多需要监听的地方，如果每一个地方都绑定这个逻辑，一是让代码量更多，二是代码冗余，可维护性会非常差。

有了痛点之后，那么可以用一个自定义 Hooks useLifecycle 来解决问题。 如上，**本质上业务需要的就是页面显示或者隐藏的回调函数。** 那么使用如下所示：

**提取公共逻辑：**

```js
const appear = () => console.log('页面展示')
const disAppear = () => console.log('页面隐藏')  
useLifecycle(appear,disAppear)
```

那么 useLifecycle 的实现，代码如下所示：

```js
function useLifecycle (appear,disAppear){
    useEffect(()=>{
        const appearInstance = DeviceEventEmitter.addListener('containerAppear',()=>{
            //监听页面显示
            appear()
        })
        const disAppearInstance = DeviceEventEmitter.addListener('containerDisAppear',()=>{
            //监听页面隐藏
            disAppear()
        })
        return function (){
            appearInstance.remove()
            disAppearInstance.remove()
        }
    },[])
}
```

**解决痛点：**

这样就可以把逻辑，抽离到自定义 Hooks 中了，不过这样会有一个问题，就是需要把 appear,disAppear 添加到 useEffect 的 dep 中，这样每一次组件更新，都需要重复绑定，这个时候就需要 useRef 来助力了，用 useRef 保存的状态，不需要加入依赖项，改造如下：

```js
function useLifecycle (appear,disAppear){
    const appearRef = useRef()
    const disAppear = useRef()
    appearRef.current = appear
    disAppear.current = disAppear
    useEffect(()=>{
        const appearInstance = DeviceEventEmitter.addListener('containerAppear',()=>{
            //监听页面显示
            appearRef.current && appearRef.current()
        })
        const disAppearInstance = DeviceEventEmitter.addListener('containerDisAppear',()=>{
            //监听页面隐藏
            disAppear.current && disAppear.current()
        })
        return function (){
            appearInstance.remove()
            disAppearInstance.remove()
        }
    },[])
}
```

这样 useLifecycle 的自定义 Hooks 就实现了。

## 四 RN 自定义 Hooks 的实践

知道了自定义 Hooks 的设计之后，来看一下 RN 中自定义 Hooks 的实践。

### 4.1 同步更新的 useSyncState

上面说到了，当函数组件用 useState 的时候，是获取不到最新的 state 值的，只有在下一次函数组件渲染的时候，才能获取到，而且 useState 也有一些弊端，比如 useEffect ，useMemo 如果使用 useState 状态，需要将状态加入依赖项 dep 中，除此之外，我们设计的自定义 hooks 还可以自动渲染是否更新视图，具体特点如下：

* 同步更新 state ，更新完 state，可以在相同的上下文中获取最新的状态。
* 不受到 useEffect | useLayoutEffect | useMemo | useCallback 依赖项的影响
* 可以自由选择是否更新组件，有的情况下，可能在同一上下文中多次触发 state，这个是没有必要的，所以可以选择是否更新组件。用于精致化渲染。

```js
mport { useState, useRef } from 'react'

function useSyncState (initState:any){
  const [, forceUpdate] = useState(null)
  const state :any = useRef(typeof initState === 'function' ? initState() : initState)
  /**
   * 改造 dispatchAction 函数
   * @param updateState   更新的值，与 useState 的 dispatchAction 一直
   * @param isEmitUpdate  此次 updateState 是否触发一次渲染
   */
  const update = (updateState:any, isEmitUpdate:boolean = true) => {
    const nextState = typeof updateState === 'function' ? updateState(state.current) : updateState
    state.current = nextState
    isEmitUpdate && forceUpdate({})
  }
  return [ state, update ]
}

export default useSyncState
```

如上，用 useState 来触发更新，用 useRef 来保存更新状态，重写了 dispatchAction 方法，第二个参数可以控制是否更新。

使用：

```js
const [ value ,setValue ] = useSyncState(0)
const handleClick = ()=>{
    setValue(1)
    console.log(value.current) // 1
    setValue(2,false) // 只更新数据，不渲染视图
}
```

### 4.2 useExecuteLastCb 带有节流功能的 callback

在 RN 中，每一个视图更新都需要 JS 线程向 Native 通信，如果短时间频繁更新的成本是昂贵的，而且可能会影响性能，进一步影响用户响应。

那么接下来设计一个在规定时间内频繁触发的事件中，只执行最后一次事件的 hooks 。保障多次触发的时候，只保留一次有效的事件。

```js
/**
 * @param cb 事件执行函数
 * @param delay 规定的延时时间
 * @returns 包装的函数
*/
export default function useExecuteLastCb (cb:Function, delay:number){
  const timer = useRef(null)
  const callback = useCallback((value:any) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => {
      cb(value)
    }, delay)
  }, [])
  return callback
}
```

如上就是自定义的 hooks 的实现，用 useRef 来保存 timer, 用 useCallback 来保存事件。

使用：

```js
const handleScroll = useExecuteLastCb(()=>{
    //发生更新
},200)
return <ScrollView onScroll={ handleScroll } ></ScrollView>
```

如上将 ScrollView 绑定 handleScroll 方法，在 200 handleScroll 只会执行一次，保障了事件的稳定执行。

### 4.3 获取元素 useUiManager

在 RN 项目中，获取元素的位置，可能并不容易，首先就是 RN 不能像 web 应用中，直接操作 DOM 来获取元素大小，位置等信息；有一些状态，更新受到通信的影响，也不能及时更新；而且在安卓和 iOS 也会有差异性。

为了解决这个问题，下面来实现一个自定义 hooks，能够实现以下功能：

* 能够实时获取元素信息，包括 left 值，top 值，视图位置，元素大小等。
* 当被监控的元素发生变化的时候，会触发更新。

```js
import { useRef, useLayoutEffect, useCallback } from 'react'
import useSyncState from './useUpdateState'

/**
 * 用于获取状态信息，保存状态信息
 * @param isInit 是否在初始化的时候进行获取
 * @param deps 是否有依赖项，依赖项改变会，重新计算布局
 * @returns currentNode 获取元素信息 ｜ getLayout 获取元素位置，适合不常变化的元素 ｜getLayoutUiManager 实时获取元素状态信息 | onLayout 绑定元素里面的 onLayout 事件
 */
export default function useUiManager (isInit: Boolean = false, deps = []) {
  const currentNode = useRef(null)
  const [nodeInfo, setNodeInfo] = useSyncState({}) as any
  const getLayoutUiManager = () => {
    if (!currentNode.current) {
      return
    }
    return new Promise((resolve) => {
      currentNode.current?.measure((left, top, width, height, pageX, pageY) => {
        const nodeInfo = { left, top, width, height, pageX, pageY }
        setNodeInfo(nodeInfo, false)
        resolve(nodeInfo)
      })
    })
  }
  const getLayout = useCallback((type) => {
    if (type && nodeInfo.current) {
      return nodeInfo.current[type]
    }
    return null
  }, [])
  /* 提供给 UI 组件的 onLayout 方法 */
  const onLayout = useCallback((e) => {
    const layout = e?.nativeEvent?.layout
    if (layout) {
      const { height, width, x, y } = layout
      const oldInfo = nodeInfo.current
      const newInfo = { left: x, top: y, width, height, pageX:oldInfo.pageX, pageY:oldInfo.pageY }
      if (
        oldInfo.left   !== newInfo.left   ||
        oldInfo.top    !== newInfo.top    ||
        oldInfo.height !== newInfo.height ||
        oldInfo.width  !== newInfo.width) {
        setNodeInfo(newInfo, true)
      }
    }
  }, [])
  useLayoutEffect(() => {
    isInit && getLayoutUiManager()
  }, deps)
  return [currentNode, getLayout, getLayoutUiManager, onLayout]
}
```

这个 hooks 都做了些什么呢？让我们一起盘点一下：

* 为了能够动态获取元素，可以通过 ref 来标记元素，获取到元素之后，通过 measure 来查询元素的信息，那么这个 hooks 需要把 ref 暴露出去，并且需要提供一个 getLayoutUiManager 可以动态获取元素信息的方法。

* 当元素信息发生改变的时候，需要通过 onLayout 函数查询到最新的元素信息，并且如果元素信息发生变化，那么通过上面的 useSyncState 保存信息，并触发更新，并且提供 getLayout 方法，可以让实时获取元素信息。

经历上面两步操作之后，就可以在每一个时间节点上，精准地获取元素的信息。

使用：

```js
function Demo(){
    const [currentNode, getLayout, getLayoutUiManager, onLayout] = useUiManager()
    const getElementInfo = ()=>{
        console.log(getLayout()) //获取元素信息
    }
    return <View ref={currentNode}  onLayout={onLayout} ></View>
}
```

## 五 总结

本章节介绍了 RN 中 React Hooks 的应用，自定义 Hooks 的设计以及实践，下一章中，我们将介绍 RN 中性能优化的手段。