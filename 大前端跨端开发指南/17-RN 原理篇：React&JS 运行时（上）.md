## 一 前言

介绍完 RN 的基本情况，本章节和下一章节将介绍 RN 在 JS 运行时的原理。

在讲解过程中，将对比 React 在 web 端上和在 RN 端的差异，并从 RN 应用的**初始化**和**更新**两个流程介绍原理。

在第十六章，讲到了 RN 的整体架构，其中 RN 应用整体分为四个部分：

* RN JS 运行时: 会运行整个 RN 应用，也就会运行业务代码，形成虚拟 DOM 。
* JS 引擎：提供 JS 运行环境。
* Native 层：有 Android 和 iOS 进行 Native 渲染页面。
* 通信层：通过 C++ 连接 JS 层和 Native 层，提供基础的通信能力。

## 二 RN 渲染运行时概览

来回顾一下 RN 应用的整体流程，首先我写的 JSX 代码会被 Babel 编译成 JS 代码，然后 Native 启动 RN 应用，通过 createElement 形成 element 树结构，然后在 React Reconciler 调和节点形成虚拟 DOM 树。

Native 根据形成的虚拟 DOM fiber 树形成一个中间态的 Shadow Tree 。对于 Shadow Tree 的形成，由 JSI ，Fabric 和 TurboModules 构成的新架构与老 RN 架构会有一定的区别，在**渲染原理**和**通信原理**章节会讲到。Shadow Tree 的形成主要是用于做布局计算，描绘出整个页面的视图信息。

有了这些信息，就可以通过 Native 的主线成进行绘制，形成真正的视图渲染树，这里先称之为 Native tree。

这三个 tree 分别在 JS 线程, C++ 线程 和 Native 的主线程来完成。

整个流程如下所示：

![3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7984c7f8247c404abbc0112120b3b5a0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1524&h=1036&s=122570&e=png&b=ffffff)

那么 React 运行时主要完成的就是如上的创建虚拟 DOM 树的过程。

**web 中的 React 应用和 RN 应用的区别：**

首先无论是 web 应用还是 RN 应用都可以直接引用 React 库，里面提供了最基础的 React 库，提供了最基础的 api ，比如 Component 和创建 React element 的方法，或者是函数组件的 Hooks 等。这些都是调用 React 底层方法完成更新的桥梁。

在 React web 应用中，整体会存在 render 和 commit 两个阶段, 在 render 阶段会通过深度递归遍历的方式找到发生更新的组件，然后通过 diff 的方式确定元素的增删改，在这个期间会打不同的 flag 更新标志。在 commit 阶段，同样会遍历发生更新的节点，处理这些更新标志，进行真实的元素处理。而这一切都是在 react-reconciler 库中进行的。

这俩点 RN 和 React web 应用有本质的区别，在 RN 中整个应用入口如下所示：

![1.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56816b0b49af4a9db678b4a6c87d3f1d~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=598&h=656&s=99685&e=png&b=272728)

![2.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9646469471c847898e747ffa1e360940~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=700&h=366&s=60784&e=png&b=272728)

在 RN 中没有使用 react-reconciler 库，取而代之是自己实现的一套流程，这套流程和 react-reconciler 非常像，里面也有 render 阶段和 commit 阶段，render 阶段对于 RN 是否发生更新, 打上特有的标志，然后在 commit 阶段触发更新方法通过通信的方式完成更新。

在 web 应用中有 react-dom 负责 DOM 更新，DOM 事件等 API，在 RN 中因为采用的是 Native 渲染模式，所以也就没有 react-dom 的概念。

在新老 RN 架构中，对于 commit 的阶段触发视图的方式会有区别，接下里会重点介绍。

接下来看一下具体的实现流程和细节。

## 三 RN 应用初始化实现

### 3.1 应用注册

我们来通过一个例子描述 RN 应用整个初始化流程。RN 上手还是非常简单的，比如想要创建一个 RN 应用，可以通过 **AppRegistry.registerComponent** 的方式：

```js
import {AppRegistry} from 'react-native'
/* 根组件 */
import App from './app' 

AppRegistry.registerComponent('MyReactNativeApp', () => <App />)
```

一个 RN 应用起源来源于 registerComponent 的方法，这个方法会确定当前 RN 应用的名称为：`MyReactNativeApp`，渲染函数为 () => App, 接下来会把主体渲染函数, 注册到全局的 runnables 对象中。来看一下具体实现：

> Libraries/ReactNative/AppRegistry.js

```js
const runnables: Runnables = {};
const AppRegistry = {
    /* 注册应用 */
    registerComponent(appkey,componentProvider){
        /* 注册应用 MyReactNativeApp ，注册到 runnables */
        runnables[appkey] = {
            componentProvider,
            run:(appParameters) => {
                renderApplication(RootComponent,appParameters.initialProps)
            }
        }
    },
    /* 运行应用 appKey -> 应用名称 ｜ appParameters -> 初始化参数 */
    runApplication(appKey,appParameters){
        /* 运行当前的应用 */
        runnables[appKey].run(appParameters);
    }
}
```

如上可以看到 registerComponent 过程中，向 runnables 注册应用，其中封装了运行应用的 run 方法，在该方法内部，本质上调用的是 renderApplication 来初始化应用。 Native 启动 RN 应用的时候，已经通过 registerComponent 把应用注册完成了，不过并没有立即运行。

运行 RN 的方式是如上的 runApplication 的方法，在主体程序完成注册之后，RN 应用会被 Native 应用启动，客户端就可以通过 AppName （如上的 MyReactNativeApp）在 runnables 上找到对应的 RN 程序，然后就可以调用 run 方法来运行应用。

来看一下在 Native 应用中，是如何运行的 runApplication 的。以 Android 为例子,来看一下这么运行的：

```java
@Override
  public void runApplication() {
        catalystInstance.getJSModule(AppRegistry.class).runApplication(jsAppModuleName, appParams);
  }
```

如上就是 Android 启动 RN 程序的入口函数，接下来看一下 renderApplication 的实现。

### 3.2 应用初始化

所有的应用都是通过 renderApplication 来实现的。

> Libraries/ReactNative/renderApplication.js

```js
export default function renderApplication(RootComponent,initialProps){
    /* 创建一个容器组件 */
    let renderable = <PerformanceLoggerContext.Provider >
       <AppContainer>
            <RootComponent {...initialProps} rootTag={rootTag} />
       </AppContainer>
    </PerformanceLoggerContext.Provider>
    /* 调用 renderElement 初始化整个应用 */
    Renderer.renderElement({
    element: renderable,
    rootTag,
    useFabric: Boolean(fabric),
    useConcurrentRoot: Boolean(useConcurrentRoot),
  });
}
```

如上就是 RN 应用的初始化流程，在初始化阶段，会创建一个容器组件 renderable , 其中 RootComponent 组件就是就是注册的时候，传入 registerComponent 的第二个参数，接下来就会调用 Renderer.renderElement 进入正式渲染流程了。随便说一句，这里的 renderElement 对于整个 RN 相当于 React web 中的 ReactDOM.render。

renderElement 的流程如下所示：

```js
export function renderElement({ element,rootTag,useFabric }){
    if (useFabric) {
        require('../Renderer/shims/ReactFabric').render(
        element,
        rootTag,
        null,
        useConcurrentRoot,
        );
    } else {
    require('../Renderer/shims/ReactNative').render(element, rootTag);
  }
}
```

在 renderElement 中通过 if 来判断是否进入 **Fabric 架构**，Fabric 架构早在 2018 年就已经推出，但是 RN 依然兼容这老版本的架构，这里先介绍一下新老版本的 RN 渲染架构实现。

在老版本架构中，整个 RN 特有的 reconciler 流程是一样的，但是对于 commit 阶段发出的渲染指令是不同的，区别如下：

* 在老版本中，通过 ReactNativePrivateInterface 中的 UIManager 模块发起桥通信，把渲染指令通信给 Native 端，然后由 Native 形成 Shadow Tree。

* 而在 Fabric 架构中，是基于 JSI 的，JSI 中提供了特性，可以待用 C++ 提供global 对象上的 nativeFabricUIManager 对象，调用对应的方法在 C++ 形成 Shadow Tree 。

我们以 Fabric 架构为线索，探索整个渲染阶段流程。

## 四 RN render 阶段实现

如上的例子中，如果我们在 App 中写的视图结构，看一下最终会变成什么样子：

```js
import { View, Text } from 'react-native'
function App(){
    return <View>
       <Text>小程序：《大前端跨端开发指南》</Text>
       <View>
          <Text>作者：我不是外星人</Text>
       </View>
    </View>
}
```

如上一个代码，在 Babel 编译阶段，会被编译 Element 的形式，接下来在 `./Renderer/shims/ReactFabric` 中会进行 RN fiber 树形成流程。来看一下 ReactFabric 中的 render 方法。

```js
function render(element){
    /* 创建 fiber root */
    const concurrentRoot = new FiberRootNode()
    /* 初始化更新队列 */
    initializeUpdateQueue(root)
    /* 更新容器 */
    updateContainer(element, root, null, callback);
}
```

这个就是 RN 中 Reconciler 的开端，主要做了三件事：

* 创建一个 fiber root 根节点。
* 初始化更新队列。
* 然后更新容器。

updateContainer 就是核心入口， 这个方法的内部会做一些更新初始化的操作，比如创建一个初始化更新对象 update 等，然后调用 scheduleUpdateOnFiber 开始正式调和节点。在这个方法中，会通过 scheduleCallback 异步的方式更新 performSyncWorkOnRoot 。

对于 scheduleCallback 的细节，这里就不过多赘述了，其本质原理就是防止过多的渲染任务造成阻塞，从而影响用户体验，所以需要通过类似 setTimeout 的 API （在 web 端用的是 MessageChannel API）创建一个微任务，用微任务的方式执行这些更新任务，防止短时间内的任务阻塞。

其中重点就是这个 performSyncWorkOnRoot 方法。那么这个方法到底做了些什么呢？

```js
function performSyncWorkOnRoot(){
    /* render 阶段 */
    var exitStatus = renderRootSync(root, lanes);
    /* commit 阶段 */
    commitRoot(root,workInProgressRootRecoverableErrors,
workInProgressTransitions);
    /* 确定是否有其他的更新任务 */
    ensureRootIsScheduled(root, now());
}
```

我将整个流程简化，保留核心流程：

* 第一个就是 render 阶段，会调和整个 fiber 树，这个期间包括整个 fiber 虚拟 DOM 的创建，给每一个虚拟 DOM 节点打上不同的 flags 比如创建，删除，更新。
* 第二个就是 commitRoot 是在 commit 阶段执行的，这个过程中会通过不同的 API 向 Native 发送不同的指令，接下来 Native 会渲染真实视图。
* 第三个就是通过 ensureRootIsScheduled，确定是否有其他的更新任务，如果有其他的更新任务，那么进行更新。

这里的核心就是两大阶段，在正式讲解两大阶段之前，来看一下 RN 中的虚拟节点 fiber。

**fiber 节点介绍：**

fiber 就是一个虚拟元素节点，fiber 的上面保存了有关当前元素的信息。每一个 fiber 是通过 return ， child ，sibling 三个属性建立起联系的。

* return： 指向父级 Fiber 节点。
* child： 指向子 Fiber 节点。
* sibling：指向兄弟 fiber 节点。

如上例子，最终形成的 fiber 结构如下所示：

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0b6849f302414a83a6f7699ab57765~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=654&h=880&s=81522&e=png&b=ffffff)

接下来我们通过 render 阶段和 commit 阶段，看一下整个 fiber 树形成更新流程:

在 renderRootSync 中会执行 workLoopSync，这个函数通过深度遍历的方式遍历 fiber 节点。

```js
function workLoopSync() {
  for (; null !== workInProgress; ) performUnitOfWork(workInProgress);
}
function performUnitOfWork(unitOfWork) { 
  /* 执行 beginWork */  
  var next = beginWork$1(unitOfWork.alternate, unitOfWork, subtreeRenderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  /* 执行 completeUnitOfWork */
  null === next ? completeUnitOfWork(unitOfWork) : (workInProgress = next);
  ReactCurrentOwner$2.current = null;
}
```

每一个 fiber 可以看作一个执行的单元，在调和过程中，每一个发生更新的 fiber 都会作为一次 workInProgress。 workLoopSync 会遍历一遍 fiber 树，执行 performUnitOfWork ，这个函数包括两个阶段 beginWork 和 completeWork 。

`beginWork` ：是向下调和的过程。就是由 fiberRoot 按照 child 指针逐层向下调和，期间会执行函数组件，实例类组件，diff 调和子节点，打不同effectTag。在 beginWork 中，如果是类组件，那么会实例化类组件，如果是函数组件，那么会通过 renderWithHooks 运行我们的函数组件。

```js
function beginWork(current,workInProgress, renderLanes){
    switch(workInProgress.tag){
        // case1:如果是函数组件，那么通过 renderWithHooks 执行
        // case2:如果是类组件，那么初始化或者更新我们的类组件。
    }
}
```

`completeUnitOfWork` ：是向上归并的过程，如果有兄弟节点，会返回 sibling兄弟，没有返回 return 父级，一直返回到 fiebrRoot，在遍历节点的过程，会触发 completeWork ，如果是新节点，那么会通过 `createNode` 创建新的节点，通过 `createTextInstance` 创建文本节点 ，在 web 端 React 中，这里会创建真实的 DOM 节点。

```js
function completeUnitOfWork(unitOfWork) {
  var completedWork = unitOfWork;
  do {
    /*  */  
    var current = completedWork.alternate;
    unitOfWork = completedWork.return;
    if (0 === (completedWork.flags & 32768)) {
      if (
       completeWork(current, completedWork, subtreeRenderLanes)
      ) {
        workInProgress = current;
        return;
      }
    } else {
      current = unwindWork(current, completedWork);
    }
    /* 遍历兄弟节点  */
    completedWork = completedWork.sibling;
  } while (null !== completedWork);
}
```

这么一上一下，构成了整个 fiber 树的调和。最初的例子在整个 workLoop 过程中，整体调和过程如下所示：

![5.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20e2479c493940c4bc9c36cbd9327742~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1342&h=852&s=107708&e=png&b=ffffff)

那么经过 render 阶段后，会形成整个 fiber 树，对于新元素会调用对应的方法创建，对于发生更新的情况，或者是一些生命周期，会通过 flag 标志，在 commit 阶段统一处理。那么我们来看一下 RN 中的 commit 阶段的细节。

## 四 RN commit 和新老 RN 架构的区别

在如上 performSyncWorkOnRoot 中，最后会调用 commitRoot 进入到 commit 阶段。

在 commit 阶段，可以执行类组件对应的生命周期，比如 componentDidMount 和 componentDidUpdate, 同样可以执行函数组件对应的 hooks 的回调函数，比如 useEffect 和 useLayoutEffect 。 commit 阶段也分为三个节点，分别是 BeforeMutation 更新前， Mutation 更新，Layout 更新后。三个阶段处理的事情会有本质的区别。

在 commitRoot 阶段本质上执行的是 `commitRootImpl`, 看一下这个方法的细节。

```js
function commitRootImpl(){
    do flushPassiveEffects();
    while (null !== rootWithPendingPassiveEffects);
    /* 保留核心逻辑 */
    /* BeforeMutation */
    commitBeforeMutationEffects(root, transitions);
    /* Mutation */
    commitMutationEffectsOnFiber(transitions, root);
    root.current = transitions;
    /* Layout */
    commitLayoutEffects(transitions, root, lanes);
}
```

RN 中的 setState 的第二个参数 callback 以及生命周期都是在这里执行的。在 web 应用中在 commit 阶段，会调用 DOM 对应的 API 去操纵真实的元素节点，比如 createElement, appendChild ，在 RN 中不能直接调用对应的 API ，需要调用 RN 提供的方法实现。这里老架构 RN 和 Fabric 架构的 RN 会有区别。

**Fabric 架构：**

* 在 Fabric 架构中，会调用 `nativeFabricUIManager` 提供的对应的 API ，比如创建元素节点调用的是 createNode ,添加元素节点调用的是 appendChild。如下所示：

```js
var _nativeFabricUIManage = nativeFabricUIManager,
  createNode = _nativeFabricUIManage.createNode,
  cloneNode = _nativeFabricUIManage.cloneNode,
  appendChildNode = _nativeFabricUIManage.appendChild,
```

可以通过 createNode 创建 Native 元素，比如 View ，Text 组件，它们本质上是 HostComponent ，在创建 HostComponent （如上 View 等标签对应的 fiber 类型）的时候，需要调用 createInstance。来看一下这个方法做了些什么？

创建元素节点，如 View:

```js
function createInstance(type,props,rootContainerInstance,hostContext){
    /* 创建元素节点 */
    var node = createNode(
        tag, // reactTag
        viewConfig.uiViewClassName, // viewName
        rootContainerInstance, // rootTag
        updatePayload, // props
        internalInstanceHandle // internalInstanceHandle
    );
    var component = new ReactFabricHostComponent(
        tag,
        viewConfig,
        props,
        internalInstanceHandle
    );
}
```

在 createInstance 中，通过 createNode 创建一个 Native 元素节点。

再来看看创建文本节点：

```js
function createTextInstance(text,rootContainerInstance,hostContext){
    var node = createNode(
    tag, // reactTag
    "RCTRawText", // viewName
    rootContainerInstance, // rootTag
    {
      text: text
    }, // props
    internalInstanceHandle // instance handle
  );
}
```

可以看到在 `createTextInstance` 中，创建了 viewName 固定为 ‘RCTRawText’ 的元素节点。

上面介绍了 Fabric 基于 JSI , nativeFabricUIManager 本质上是 JSI 暴露给 RN 运行时的特有对象，挂载在 global 对象上。

```js
const FabricUIManager: FabricUIManagerSpec = global?.nativeFabricUIManager;
```

**老架构：**

* 老架构是基于桥通信的，本质上调用的是 ReactNativePrivateInterface 的 UIManager 接口，来对比一下现有老架构中 createInstance 和 createTextInstance 的实现。

创建 View 元素：

```js
function createInstance(){
    ReactNativePrivateInterface.UIManager.createView(
        tag, // reactTag
        viewConfig.uiViewClassName, // viewName
        rootContainerInstance, // rootTag
        updatePayload // props
    );
    var component = new ReactNativeFiberHostComponent(
        tag,
        viewConfig,
        internalInstanceHandle
    );
}
```

创建文本元素：

```js
function createTextInstance(){
    ReactNativePrivateInterface.UIManager.createView(
        tag, // reactTag
        "RCTRawText", // viewName
        rootContainerInstance, // rootTag
        {
        text: text
        } // props
   );
}
```

同样也是通过 UIManager 上的 createView 函数，创建一个 viewName 为 ‘RCTRawText’ 的 Native 节点。

上面的 UIManager 具体映射到原生平台不同的类方法，对于Android 来说，映射到 UIManagerModule 类的 createView 方法；对于 iOS 来说，映射到 RCTUIManager 类导出的 createView 方法。

```js
// Android端
@ReactMethod
public void createView(int tag, String className, int rootViewTag, ReadableMap props) {
  //...省区
  mUIImplementation.createView(tag, className, rootViewTag, props);
}
// iOS端
RCT_EXPORT_METHOD(createView
                  : (nonnull NSNumber *)reactTag viewName
                  : (NSString *)viewName rootTag
                  : (nonnull NSNumber *)rootTag props
                  : (NSDictionary *)props)
```

**新老架构的差异：**

接下来用一幅图描述一下新老 fabric 架构的对比:

![6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce35021de80c46fcab13865623b8d230~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1914&h=1042&s=169977&e=png&b=ffffff)

如上就是新老架构的对比，对于 React Reconciler 的部分，新老架构是没有区别的，主要区别就是绘制执行传递给 Native 这一部分，fabric 架构直接在 C++ 构建 Shadow DOM，避开了桥通信在 Native 构建 Shadow （这一部分在后面章节会讲到）, 提升了通信和渲染性能。

## 五 总结

本章节从原理层面介绍了 RN 应用初始化阶段做了哪些事情，RN 的 render 和 commit 两大阶段，以及新老 RN 架构的区别。

在下一章节，将继续探讨 RN 运行时的奥秘。