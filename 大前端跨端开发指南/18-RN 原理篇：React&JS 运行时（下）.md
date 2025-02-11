## 一 前言

上一章节中，介绍了 RN 运行时的原理，包括 RN 的注册流程，RN 应用初始化的流程，RN 虚拟 DOM 的构建流程，以及新老架构中的渲染指令的传递。

本章节继续以 RN 的 JS 运行时为切入点，介绍 RN 底层的运转奥秘。通过本章节的学习，将收获以下内容：

* RN 中的组件本质。
* RN 中是如何处理事件，以及 setState 之后的更新全流程。
* RN 中的动画原理。

## 二 RN 里面的组件

RN 移动端应用和 web 移动端应用最大的区别就是渲染模式的不同，RN 是采用 Native 原生渲染的方式，所以在 RN 中是不能像 webview 一样使用 DOM 元素标签的，比如 div，span 等。

取而代之的是, RN 提供了对应的视图组件，比如 View 组件，Text 组件等。接下来以 View 为切入点，探索一下 RN 中的基础视图组件的奥秘。

RN 中的组件在 Libraries/Components 文件夹下面，如下可以看到 RN 中的原生组件：

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2e144aed74564736a77ec72d91a75831~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=874&h=1194&e=png&b=252526)

以 View 组件为参考，看一下内部运转逻辑。

```js
const View = React.forwardRef((props,forwardedRef)=>{
   return <TextAncestor.Provider value={false}>
       <ViewNativeComponent {...props}  />
   </TextAncestor.Provider >
})
```

如上就是 View 的底层实现，其中 ViewNativeComponent 就是 viewName 名称为 `RCTView` 的原生组件。

这样在 RN 的调和阶段，被标记成 HostComponent 的 fiber ，然后可以通过 createNode 传递 RCTView 组件的绘制指令，这样 Native 就可以渲染对应的视图了。

## 三 RN 事件处理和更新逻辑

在 RN 中，比如有一段代码如下所示：

```js
function Demo (){
    const [ number, setNumber ] = useState(0)
    const handleClickAdd = () => {
        setNumber(number + 1)
    }
    return <TouchableOpacity onPress={handleClickAdd} >
        <View ><Text>{ number }</Text></View>
    </TouchableOpacity> 
}
```

如上在 Demo 组件里绑定一个点击事件 handleClickAdd，当触发点击事件的时候，会更新 number 状态触发更新，那么整体交互流程是什么样的呢？

**RN 中的事件处理**

在 web 应用中，可以用事件监听器，监听浏览器事件，在 RN 中也是通过监听 Native 事件的方式。以 Fabric 架构为例子，在 \_nativeFabricUIManage 上有一个函数registerEventHandler 用来注册 React JS 线程事件处理函数 dispatchEvent。核心流程如下所示：

```js
var registerEventHandler = _nativeFabricUIManage.registerEventHandler

if (registerEventHandler) {
  /* 通过 native 桥的方式注册事件处理函数 dispatchEvent */
  registerEventHandler(dispatchEvent);
}
```

这样注册之后，当 Native 感知到点击事件之后，就会触发 dispatchEvent 函数，会把当前触发事件的元素信息，以参数的形式传递给 dispatchEvent 函数。在 RN 中，**事件处理都要经过 dispatchEvent 函数。** 来看一下内部的实现：

```js
function dispatchEvent(target,...){
    /* 找到对应事件发生的 fiber  */
    var targetFiber = target;
    /* 执行批量更新逻辑 */
    batchedUpdates(function(){
        /* 处理事件 */
        runExtractedPluginEventsInBatch(
          ... 
        );
    })
}
```

在 dispatchEvent 中，会找到触发事件对应的 fiber 元素节点，然后通过 `batchedUpdates` 执行批量更新逻辑。

批量更新逻辑：批量更新指的是防止在同一个上下文中，执行多次 setState 或者是 useState 的 dispatchAction 而造成的多次重复更新。比如如下一段代码：

```js
handleClick(){
    this.setState({ number:1 })
    this.setState({ name:'Alien' })
}
```

如上在 handleClick 中有两个 setState, 通过 batchedUpdates 会合称为一次更新作用，其原理和 web 端如出一辙。

```js
var isInsideEventHandler = false;
function batchedUpdates(fn){
  /* 设置开关为 true */  
  executionContext |= BatchedContext;;
  try {
    /* 执行 runExtractedPluginEventsInBatch 回调函数  */  
    return fn();
  } finally {
     /* 重置开关状态 */ 
    executionContext = prevExecutionContext;
    /* 统一执行更新 */
  }
}
```

批量更新的逻辑实际很简单，本质上就是通过一个开关 executionContext ，这个开关为 BatchedContext，证明此次更新发生在事件处理函数内部，那么就可以不着急发生更新，而是等到事件处理完成（比如上面的 handleClick）执行完毕，再统一触发更新。这样就保障了在事件内部多次更新会合并成一次更新。

回到主流程 runExtractedPluginEventsInBatch 上来，来看一下做了哪些事情。

```js
function runExtractedPluginEventsInBatch(
  topLevelType,
  targetInst,
  nativeEvent,
  nativeEventTarget
) {
  /* 构建事件对象，找到对应的事件处理函数 */
  var events = extractPluginEvents(
    topLevelType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  );
  /* 执行事件 */
  runEventsInBatch(events);
}
```

找到了发生事件的 fiber 虚拟节点，接下来构建事件源对象，找到对应的事件处理函数（如上的 handleClick,然后分别执行事件处理函数就可以了。

**RN 中的更新逻辑**

在上一章节中，讲到了 RN 的初始化逻辑，那么如果触发一次 setState 会经历哪些流程。

当 RN 组件中触发 setState 的时候，本质上是触发 React.Component 上的 setState 方法，来看一下具体实现。

```js
function Component(props, context, updater) {
  this.props = props;      //绑定props
  this.context = context;  //绑定context
  this.refs = emptyObject; //绑定ref
  this.updater = updater || ReactNoopUpdateQueue; //上面所属的updater 对象
}
/* 绑定setState 方法 */
Component.prototype.setState = function(partialState, callback) {
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
}
```

如上可以看出 Component 底层 React 的处理逻辑是，类组件执行构造函数过程中会在实例上绑定 props 和 context ，初始化置空 refs 属性，原型链上绑定setState、forceUpdate 方法。对于 updater，React 在实例化类组件之后会单独绑定 update 对象。

那么在 RN 中 React 组件是什么时间节点被实例化的呢？顺着线索往下看：

原来在初始化的过程中，最后会执行到 beginWork 中，在 beginWork 会根据不同的 fiber 类型执行不同的处理逻辑。

```js
function beginWork(){
    switch (workInProgress.tag) {
        case FunctionComponent: {} // 函数组件逻辑
        case ClassComponent: { //类组件逻辑
            return updateClassComponent(...)
        }
    }
}
```

可以清晰的看到，如果是类组件的话，会触发 `updateClassComponent` 方法，在这个函数中，如果是第一次渲染的时候，会实例化类组件，然后给类组件传递 updater 对象。updater 的样子如下所示：

```js
var classComponentUpdater = {
  enqueueReplaceState: function(inst, payload, callback) {
    /* 获取当前 fiber  */  
    var fiber = get(inst);
    /* 创建一个 update */
    var update = createUpdate(eventTime, lane);
    /* 触发更新 */
    scheduleUpdateOnFiber(root, fiber, lane, eventTime);
  }
  ...
}
```

如上 classComponentUpdater 就是组件实例上的 updater 对象。当触发 setState 的时候，会获取当前 fiber 虚拟节点，然后创建一个 update 对象，最后调用 scheduleUpdateOnFiber 触发更新。

```js
function scheduleUpdateOnFiber(){
    ensureRootIsScheduled(root, eventTime);
}
```

如上保存了最核心的流程，scheduleUpdateOnFiber 本质上就是调用 ensureRootIsScheduled 开始整体更新。在上一章节中，已经介绍了 ensureRootIsScheduled 为整个 fiber 树构建更新的入口函数，这里就不重复介绍了。

## 四 RN 中的动画处理

在 web 端实现动画只需要操作 DOM 就可以了，但是在 RN 中如果想要实现动画，需要 RN 提供独有的方式，那就是 Animated。先来看一下官网对于 Animated 的介绍。

> Animated库旨在使动画变得流畅，强大并易于构建和维护。Animated侧重于输入和输出之间的声明性关系，以及两者之间的可配置变换，此外还提供了简单的 start/stop方法来控制基于时间的动画执行。创建动画最基本的工作流程是先创建一个 Animated.Value ，将它连接到动画组件的一个或多个样式属性，然后使用Animated.timing()通过动画效果展示数据的变化。

想要用 Animated 实现动画效果，需要三个核心部分：

* Animated.Value, 其内部负责调用 Native 动画对应的 api。
* Animation 提供了运动函数，比如 Animated.timing 等方法。
* AnimatedComponent，负责承载动画的视图容器组件，Animated 内部封装了 6 个承载动画的容器组件，分别是 View ，Text ，Image ，ScrollView， FlatList, SectionList。

![2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4aafe5f7273240539d37c78708789e52~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=522&h=308&e=png&b=262627)

这些组件底层都是通过 createAnimatedComponent 创建的，这个本来是一个 HOC 高阶组件，接受普通的组件，返回一个包装的高阶组件。

```js
/* 创建一个 AnimatedComponent */
export default function createAnimatedComponent(){
    return React.forwardRef((props, forwardedRef) => {
        const [reducedProps, callbackRef] = useAnimatedProps(props);
        const ref = useMergeRefs(callbackRefforwardedRef);
        // 这里处理组件
        return <Component ref={ref} ...  />
    })
}
```

当然也可以用 Animated.createAnimatedComponent 来封装自己的组件。

我们用一个例子看一下动画怎么用：

```js
const App = () => {
  /* 第一步:创建一个 Animated Value */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  /* 第三步：执行动画 */
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  };
  /* 第二步： 创建一个 Animated.View */
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
      </Animated.View>
    </SafeAreaView>
  );
};
```

**动画初始化过程：**

如上就是一个 fadeIn 动画的实现。第一步创建一个 Animated Value 。第二步通过 Animated.View 将 Animated Value 赋值给 opacity 属性。第三步通过 Animated.timing 执行动画效果。

其中原理是这样的，当用 `Animated.View` 的时候，createAnimatedComponent 内部会用 useAnimatedProps 处理传入的 props ,本质上会创建一个 `AnimatedProps` , 在 AnimatedProps 中会根据 props.style （如上 Animated.View 的 style ）创建一个 `AnimatedStyle`, 并将自身传入到 AnimatedStyle 中。AnimatedStyle 会遍历 style 中的 AnimateValue 属性，并将自身也传入到 AnimateValue 中。

经过如上操作之后，几个动画核心对象就建立起关联。其中初始化流程关系如下所示：

![3.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d06e1155f2d4f448bfecfc319db1f2b~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1248&h=488&e=png&b=ffffff)

**动画执行过程：**

当触发缓动函数 Animated.timing().start 的时候，传入了 AnimateValue ,与 AnimateValue 建立起关联，缓动函数根据动画配置，使用 requestAnimationFrame 计算最新值并回调执行 AnimateValue 的 update 方法更新最新值。

**Native 驱动流程：**

在 Native 通信中，如上在 timing 中触发动画效果，本质上会通过 \_\_startNativeAnimation 方法将动画信息传递到 Native 侧。在其内部会通过 `__makeNative` 将动画信息映射到 Native 侧，`NativeAnimatedHelper.API.startAnimatingNode()` 将缓动函数信息映射到 Native 侧并在 Native 侧开始动画。

**\_\_makeNative：**

通过依赖关系的遍历，我们可以生成与当前 AnimatedValue 相关的所有动画节点的 JSON 信息，并在 Native 端创建相应的实例。这些动画节点包括 AnimatedValue、AnimatedStyle 和 AnimatedProps。

在 animatedValue.\_\_makeNative() 方法中，我们通过 \_children 遍历所有相关的 AnimatedProps 和 AnimatedStyle，并调用它们的 \_\_makeNative() 方法。这样做的目的是为了避免在同一个 View 上同时存在由 Native 驱动和非 Native 驱动的动画。同时，AnimatedProps 在执行 \_\_makeNative() 方法时，会将当前的 id 和 viewTag 进行绑定。

在 AnimatedValue.\_\_makeNative() 方法中，我们使用 NativeAnimatedHelper.API.connectAnimatedNodes 将动画节点的父子关系传递到 Native 端。

![WechatIMG25199.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d14b510d514458d84fd32c5c3d5e2c0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.jpg#?w=1154&h=670&e=png&b=ffffff)

**startAnimatingNode()：**

通过桥方法启动动画，该方法包含四个参数：缓动函数id、AnimatedValue id、NativeAnimationConfig（标识变化函数信息的 JSON 数据）以及动画结束的回调。

NativeAnimationConfig 是由具体的缓动函数实现的。以 TimingAnimation 为例，它会根据动画的时长来计算所需的帧数，并逐帧计算动画已执行的比例。返回的信息主要包括：type（动画驱动类型）、frames（帧数及每帧动画执行的比例）、toValue（动画的终点值）以及 iterations（是否重复执行）。

js 执行完毕，接下来就是 Native 的执行流程，会在 Native 侧创建一个动画驱动器（AnimationDriver），并将其绑定到 ValueAnimatedNode，然后将驱动器加入到 mActiveAnimations 中。

在 Native 侧，通过 GuardedFrameCallback.doFrameGuarded（CADisplayLink）/CADisplayLink 来监听帧回调，遍历 mActivityAnimations 来计算 ValueAnimatedNode 的最新值。

在更新 ValueAnimatedNode 时，通过 mChildren 引用，实现了 ValueAnimatedNode -> StyleAnimatedNode -> PropsAnimatedNode 的更新。PropsAnimatedNode.updateView() 方法会调用 UIManager.synchronouslyUpdateViewOnUIThread 来同步更新 Native View。由此可见，Native 驱动的动画也是通过更新 View 的属性来实现动画效果，而并非通过使用 Native 系统中的属性动画来实现。

以安卓为例子，看一下 updateView 的实现。

```java
public final void updateView() {
    if (mConnectedViewTag == -1) {
      return;
    }
    for (Map.Entry<String, Integer> entry : mPropNodeMapping.entrySet()) {
      @Nullable AnimatedNode node = mNativeAnimatedNodesManager.getNodeById(entry.getValue());
      if (node == null) {
        throw new IllegalArgumentException("Mapped property node does not exists");
      } else if (node instanceof StyleAnimatedNode) {
        ((StyleAnimatedNode) node).collectViewUpdates(mPropMap);
      } else if (node instanceof ValueAnimatedNode) {
        Object animatedObject = ((ValueAnimatedNode) node).getAnimatedObject();
        if (animatedObject instanceof String) {
          mPropMap.putString(entry.getKey(), (String) animatedObject);
        } else {
          mPropMap.putDouble(entry.getKey(), ((ValueAnimatedNode) node).getValue());
        }
      } else if (node instanceof ColorAnimatedNode) {
        mPropMap.putInt(entry.getKey(), ((ColorAnimatedNode) node).getColor());
      } else {
        throw new IllegalArgumentException(
            "Unsupported type of node used in property node " + node.getClass());
      }
    }
    mUIManager.synchronouslyUpdateViewOnUIThread(mConnectedViewTag, mPropMap);
  }
```

## 五 总结

本章节介绍 RN 中的事件系统，以及触发一次 setState 更新的核心流程，以及 RN 中动画的介绍及原理。在下一章节中，我们将串联整个 RN 应用的核心—通信，一起揭开 RN 通信的奥秘。