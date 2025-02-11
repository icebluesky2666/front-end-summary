## 一前言

在上一节中，我们讲到 RN 大型应用实践, 本章节继续围绕 RN 中的应用设计展开。在进入今天的正题之前，先来看一个问题，那就是为什么要有应用设计呢？

**为什么应用设计很重要？**

在研发过程中，技术方案设计是比较重要的环节，尤其对于一些大型项目，一个好的技术方案决定了后面的迭代与维护成本。如果一个大型应用，前期没有技术方案设计，那么每个人都按照自己方案去设计，迭代时间越长，就会让代码越来越复杂，越来越难以维护，并且还有一定风险，所以只能通过业务重构来解决问题。

但是如果前期的技术方案设计关节就严格把控质量，有健全完整的技术方案设计，后续迭代和维护都会按照技术方向上靠拢，应用才能有条不紊得正向发展。

这些说的可能比较抽象，下面我举一个例子：

比如整个 RN 应用中，有一个全局的 AB 实验，命中 A 实验显示样式 A , 命中 B 实验显示样式 B , 这个实验应用于很多组件中，那么每一个组件都去拉去实验，并判断实验状态，这就不是一个明智的做法。

首先，如果后面如果改动实验策略，需要把每一个使用组件的地方都修改一个遍，这无疑翻倍的增加了工作量。并且如果有忘记改动的地方，很容易造成线上时候。

这个时候技术方案设计就变得非常重要了，这个时候我们需要用设计模式将实验的判断收口到一处，然后把获取实验状态下发到每一个需要实验的组件上，就可以完成任务了，这样如果改动只需要改一处就可以了。至于实现可以有很多种方案，比如 context 或者状态管理工具，都能轻松搞定。

接下来我们聊一聊 RN 中有哪些需要设计的案例吧。

## 二 React Native 设计案例

### 2.1 bundle 设计

在 RN 应用中，最终运行线上的产物，我们称之为 bundle 本质上就是一个 JS 文件。 很多开发者可能觉得 JS 文件没什么设计模式的，但是本质上 bundle 设计上还是有很多说到的，尤其是一些大型的应用。

**RN bundle 的业务设计**

在移动端应用中，RN 可以是多种形态，可以是一个页面，也可以是一个组件（一个弹窗或者一个浮层），在 Native 中，RN 的应用最终的形态也是一个组件。开发者可以根据自己的业务场景去设计自己的 bundle。

* 比如很多页面公共一个 bundle 的场景下，可以根据业务场景**拆分 bundle**, 在毫无关联的页面中，可以拆分成多个 bundle 。
* 对于上下关联性很强的组件或者页面，可以使用相同的 bundle ，这样状态可以共享，避免了传递参数，数据通信困难。
* 对于核心的展示 RN 页面或者组件，可以进行独立分包预热的方案，提前加载 bundle ，提高渲染时长。

### 2.2 高阶组件设计模式

对于一个大型 RN 应用来说，会有很多公共基础能力，比如**监控能力**，**性能优化能力**，**埋点能力** 等，这些能力写在业务代码里面，显然是不合理的，那么这个时候就需要将**基建能力** 和**业务代码**分割开来。业务开发只关注于业务代码，而基建能力独立维护，这样能保障项目的可维护性。

解决这种场景实际很简单，用 HOC 模式在好不过了，先来介绍一下 HOC。HOC 高阶组件模式也是 React Native 比较常用的一种包装强化模式之一，高阶函数是接收一个函数，返回一个函数，而所谓高阶组件，就是接收一个组件，返回一个组件，返回的组件是根据需要对原始组件的强化。

这个时候, 我们可以把基建能力做到 HOC 里面，如果有需要基建能力的组件，那么直接通过 HOC 组件包裹业务组件就可以了。比如如下代码：

```js
function BaseHoc (Component){
    return class Wrap extends React.Component{
        /* 上报错误方法 */
        _reportError=()=>{}
        /* 上报曝光上报 */
        _reportViewPV=()=>{}
        render(){
            return <Component
               { ...this.props } 
               _reportError={this._reportError}
               _reportViewPV={this._reportViewPV} 
            />
        }
    }
}
```

如上在基础 HOC 中，声明了上报错误的方法 \_reportError 和上报曝光埋点的方法 \_reportViewPV 。这样就可以在业务组件中，使用它们了，比如如下:

```js
class Index extends React.Component {
    async componentDidMount(){
        /* 上报曝光组件 */
        this.props._reportViewPV(eventId,params)
        try{
           const data = await getServiceData()  
        }catch(e){
            /* 上报通用异常情况 */
            this.props._reportError(e)
        }
    }
    render(){
        return <View><Text>大前端跨端开发指南</Text></View>
    }
}
/* 用基础 hoc 包装 Index 组件 */
BaseHoc(Index)
```

如上用基建高阶组件 BaseHoc 包装业务组件 Index ,可以在 Index 中生命周期中上报曝光埋点，可以在数据异常的情况，进行错误上报。

### 2.3 组合模式

RN 运行时环境本质上是 Native 提供的，RN 有很多与 Native 交互的场景，这些交互有可能是通过桥的方式（NativeModule）实现的，但是如果把与 Native 耦合的部分都放在业务代码里，显然也是不切实际的。

举一个例子，在移动端，有很多应用切换，或者页面切换的场景，这个时候就需要业务组件去感知到应用的显示与隐藏。这个时候就可以通过一个容器组件。包裹业务组件，让业务组件也有自动监听页面显隐的能力。

当然监听页面显隐只是一个案例，那么如上容器组件的方式在 React 中称为组合模式。

什么是组合模式：

组合模式适合一些容器组件场景，通过外层组件包裹内层组件，外层组件可以轻松的获取内层组件的 props 状态，还可以控制内层组件的渲染，组合模式能够直观反映出 父 -> 子组件的包含关系，首先我来举个最简单的组合模式例子。

```js
<Lifecycle>
   <Test />
</Lifecycle>
```

如上通过 Lifecycle 容器组件包裹 Test, Lifecycle 里面和 Native 进行交互，还可以控制 Test 的状态，因为在 Lifecycle 中， Test 是 props.children 属性，Lifecycle 可以通过 cloneElement 方法，将 children 赋值一些新的属性。下面还原一下完整代码：

```js
import React from "react";
import { DeviceEventEmitter } from 'react-native';

class Lifecycle extends React.Component {
    constructor(){
        super()
        /* 绑定页面显示事件 */
        this.appearInstance = DeviceEventEmitter.addListener('containerAppear',()=>{
            const { showCallback } = this
            showCallback && showCallback()
        })
        /* 绑定页面隐藏事件 */
        this.disAppearInstance = DeviceEventEmitter.addListener('containerDisAppear',()=>{
            const { hideCallback } = this
            hideCallback && hideCallback()
        })
    }
    onHide(callback){
        this.hideCallback = callback
    }
    onShow(callback){
        this.showCallback = callback
    }
    /* 组件卸载的时候执行 */
    componentWillUnmount() {
        /* 解绑事件 */
        this.appearInstance.remove() 
        this.disAppearInstance.remove() 
    }
    render(){
        return React.cloneElement(this.props.children,
            { 
                onShow:this.onShow.bind(this),
                onHide:this.onHide.bind(this) 
            })
    }
}
export default Lifecycle
```

如上就是能感知到页面显示和隐藏的容器组件 Lifecycle 核心实现：

* 在 constructor 中，通过 React Native 的 DeviceEventEmitter 注册事件监听器，绑定 containerAppear 和 containerDisAppear（具体什么名字，业务是可以定义的）。
* 通过 cloneElement 将子组件绑定 onShow 和 onHide 事件，并把它们的回调函数绑定下来。
* 当 Native 感知到 RN 页面显示或者隐藏的时候，首先会执行自己的监听器函数，在监听器函数中，进而执行子组件的回调函数。
* 在组件卸载的时候，统一卸载 Native 的事件监听器。

来看一下，子组件如何监听应用的显隐：

```js
import { View, Text } from 'react-native
import React from 'react'
function Test ({ onShow, onHide }){
    React.useEffect(()=>{
        onShow && onShow(()=>{
        console.log('-----页面显示-----')
        })
        onHide && onHide(()=>{
        console.log('-----页面隐藏-----')
        })
     },[])
    return <View>
       <Text>大前端跨端开发指南</Text>
    </View>
}
```

如上被 Lifecycle 包裹的组件，在 props 中多了 onShow 和 onHide 方法，可以执行这个方法，将回调函数传入，页面触发条件的时候，会执行当前方法，如下所示：

![1.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/751ca6dc1b9e4b29b4cf21c4b486ce4c~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1040&h=110&s=12530&e=png&b=2a2a2a)

在下一章中，我将用自定义的 hooks 的方式，同样能够解决这个问题。

### 2.4 状态管理设计

在 RN 应用中，涉及到了 Native -> JS 线程通信，也有组件 -> 组件的数据通信场景，所以在 RN 中的通信可能比纯 web 领域场景更加复杂，那么我们应该如何合理管理这些状态呢？

对于一些复杂的通信的场景, 如果滥用通信方式，比如胡乱选择 props callback, EventBus, 状态管理，更有甚者滥用其中的几种，会让代码非常难以维护。为了防止这个问题，有一些状态管理设计的心得：

* 对于状态管理的选择，要结合具体的业务场景或技术场景具体处理，比如如果业务场景比较复杂，设计到很多组件的通信，那么选择状态管理工具, redux 等，比如一些基建状态的传递，比如用户登录状态，或者请求通用参数，那么这个时候 context 也是不错的选择。
* 在数据通信过程中，数据的传递最好形成私有领域，也就是数据传递和接受影响的范围尽量要小，不要中途经过很多层组件的传递。这些组件如果用不到状态，并且还要维护这些状态的传递，这样的代码很难维护，也比较让人头疼。
* 对于 RN 来说，如果用到**引擎复用**的场景，如果此时把状态放到全局，那么很可能下次在进入 bundle 的时候，数据会复用上次的数据，造成一些问题。这个时候，就需要在生命周期销毁的时候，及时清空状态。

**context 监控页面渲染**

接下来我将用 context 上下文来实现一个渲染模版监控的方案。

通常情况下，使用 RN 的应用都是移动端应用， 移动端应用 toC 居多, 所以监控页面组件能够正常渲染就变得非常重要。如果用户看到模块展示不出来，就会滑走，进而影响了应用的用户体验和留存转化。

正常情况下的渲染逻辑是这样的。页面初始化 -> 数据请求 -> 页面渲染的方式，由于 React Native 中 render 阶段出现异常，会造成整个模块渲染失败，所以如果服务端返回的数据格式不对，很容器造成渲染失败的情况出现。这个时候就需要监控渲染异常了。

技术方案：

核心技术实现：context + 插桩组件

* 首先，我们用 context 保存一个记录模版状态的方法集合。在页面初始化之后, 接下来会请求数据，在请求数据之后，页面会循环渲染子组件列表，在渲染之前，记录每一个 API 返回的模版，每一个模版需要有一个唯一标识。
* 每一个渲染模版里面有一个插桩组件，插桩组件在每一个模版下部，确保组件正常渲染，插桩组件一定会渲染。插桩组件的生命周期 componentDidMount 或者 useLayoutEffect 里面，触发事件给最上层组件，并上报该模版的唯一标识。
* 根组件在完成首次渲染之后，通过短暂的延时后，对比渲染列表里面的每一个模版的标识，是否均备插桩组件上报，如果有个别组件的标识没有上报，则认为是该组件渲染异常。如果有子组件发生渲染异常，上报该子组件的渲染数据。方便查询问题。

原理图：

![2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e73d421d0241c786d70d35a1553c77~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1650&h=1198&s=172453&e=png&b=ffffff)

介绍完原理来看一下代码的实现：

渲染插桩组件：

```js
import React from 'react'
/* 上下文保存渲染异常状态 */
export const RenderErrorContext = React.createContext()
/* 渲染插桩组件 */
export default function RenderErrorComponent({renderKey}){
    const { setRenderKey } = React.useContext(RenderErrorContext)
    React.useLayoutEffect(()=>{
        /* 渲染正常，上报渲染 key */
        setRenderKey && setRenderKey(renderKey)
    },[])
    return <React.Fragment />
}
```

如上编写的渲染插桩组件 `RenderErrorComponent` 和渲染状态上下文 `RenderErrorContext` ，如果渲染插桩组件正常渲染，那么说明当前组件没有出现渲染异常，接下来需要在 `useLayoutEffect` 钩子函数里面，上传渲染成功状态。

接下来看一下使用渲染上下文的页面组件。

```js
import React, { useEffect } from 'react'
import { RenderErrorContext } from './renderError'
import Comp from './component/comp1'

/* 模拟的渲染数据 */
const renderList = [
  {
    id:1,
    data: {
      value:'我不是外星人'
    },
  },
  {
    id:2,
    data: {
      value:'大前端跨端开发指南'
    },
  },
  { /* 异常数据 */
    id:3,
    data: null
  }

]

function App() {
  const [list,setList] = React.useState([])
  const renderState = React.useRef({
    errorList:[],
    setRenderKey(id){  //如果渲染成功了，那么将当前 key 移除
      const index = renderState.current.errorList.indexOf(id) 
      renderState.current.errorList.splice(index,1)
    },
    getRenderKey(key){ //这里表示渲染了哪些组件
      renderState.current.errorList.push(key)
    }
  })
  useEffect(()=>{
      /* 记录每一个待渲染的模版 */
      renderList.forEach(item => renderState.current.getRenderKey(item.id))
      setList(renderList)
      /*  验证模版是否正常渲染，如果 errorList 不为空，那么有渲染异常的组件，里面的 item 就是渲染异常的 id */
      setTimeout(()=>{
        console.log('errorList',renderState.current.errorList)
      })
  },[])
  return (
    <RenderErrorContext.Provider value={renderState.current}>
        { list.map(item=><Comp data={item.data} id={item.id}  key={item.id} />) }
    </RenderErrorContext.Provider>
  );
}
export default App;
```

如上就是页面组件的使用，这里重点介绍一下每一个环节：

* 首先，用 ref 保存渲染状态 renderState，是一个对象，在对象里面一定要有 setRenderKey 方法，提供给插槽组件使用。最终将渲染状态传递给 RenderErrorContext 的 Provider 中，接下来每一个需要监控的下游组件都可以回传渲染状态了。
* 在 useEffect 模拟请求数据，然后根据数据，记录下来待渲染的 id，通过 getRenderKey 将 id 放入到数组中。
* 接下来当插桩组件正常渲染，那么会回传状态，证明渲染成功了，那么将此渲染 id 从数组中移除。
* 接下来用 setTimeout 验证模版是否正常渲染，如果 errorList 不为空，那么有渲染异常的组件，里面的 item 就是渲染异常的 id 。
* 在渲染列表中，我们模拟一条异常数据，就是第三条，data 为 null。

接下来看一下渲染插桩组件的使用：

```js
import React from 'react'
import RenderErrorComponent from '../renderError'
import { View, Text } from 'react-native


function Comp({ data, id }){
    return <View>
         <Text>{ data.value } </Text>
        <RenderErrorComponent renderKey={id} />
    </View>
}

function ErrorHandle (Component){
    return class Wrap extends  React.Component{
        state = {
            isError:false
        }
        componentDidCatch(){
            this.setState({isError : true })
        }
        render(){
           const { isError } = this.state
           return  isError ? null : <Component {...this.props}  />
        }
    }
}

export default ErrorHandle(Comp) 
```

如上当渲染 Comp 组件的时候，如果 data 为 null, 那么肯定会报出渲染异常，这个时候页面都不会正常显示，为了能够让页面正常展示，我们用一个错误处理组件 ErrorHandle 来防止白屏情况发生。

看一下效果：
![3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccf69af9a43f4e7f891f46347f054a32~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=698&h=1214&s=34491&e=png&b=ffffff)

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f2852e7537e43b9bc28c299d1820b41~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=602&h=54&s=8036&e=png&b=282828)

如上页面能够正常渲染，从渲染异常列表里，能够查询到渲染异常的组件 id=3,预期达成。

## 三 总结

本章节介绍了一些 RN 中设计模式的案例，感觉有帮助的读者，可以尝试在项目中应用一下技术设计。本章节作者会一直维护，在工作中，遇到一些新的设计模式思路，也会及时更新到小册中。