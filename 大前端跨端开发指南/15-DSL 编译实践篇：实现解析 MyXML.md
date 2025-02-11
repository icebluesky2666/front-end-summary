## 一 前言

前两章节中，重点介绍了 DSL 在 web 渲染模式和 Native 渲染模式的应用以及本质。其中讲到通过编译手段来实现的跨端框架是一个很普遍的场景，比如 Taro, uni-app 本质，都有一部分是通过编译来实现的。所以为了让大家更清楚的了解 DSL 在编译阶段的原理，这个章节将出一个案例，来一起探索编译的整个流程。

开发过小程序的同学都知道，在小程序中有 wxml 文件，用来描述页面的视图结构, 在编译阶段 wxml 会被编译成渲染函数形式，能够运行在 JavaScript 环境中。

我们今天设计自己的视图描述文件 .myxml ，看一下最终是怎么变成 js 结构的 。

对于核心编译流程，我们用 babel 工具链处理。来回顾 babel 的编译流程，主要分为三个步骤：

* parse：通过 parser 把源码转成抽象语法树（AST）。

> 在计算机科学中，抽象语法树(Abstract Syntax Tree，AST)，或简称语法树(Syntax tree)，是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

* transform：遍历 AST，调用各种 transform 插件对 AST 进行增删改，变成想要的文件形式。
* generate：把转换后的 AST 打印成目标代码。

## 二 parse 解析 myxml

在 parse 阶段，会把我们的 .myxml 文件，解析成语法树。比如 .myxml 文件中这么写：

```html
<view bind:tap="handleClick" class="text {{ customClass }}"  >
    <view /> 
    <text  >前端跨端进阶指南</text> 
</view>
```

生成对应的语法树结构如下：

```js
{
    tag:"view",
    attrs:{
        "bind:tap":"handleClick",
        "class":"root"
    },
    children:[
        {
            tag:"view",
            attr:{},
            children:[]
        },
        {
            tag:"text",
            attr:{},
            children:['前端跨端进阶指南']
        }
    ]
}
```

如上解析之后的语法树结构，能够形象的表述出 wxml 的视图结构，其中，一个标准的元素结构组成为：

* tag 代表的标签类型。
* attr 标签属性，是一个对象，比如 class="root" ，解析后属性名为 class ，值为 root 。
* children：表示子元素，如上第一层 view ，有两个子元素，分为是 view 和 text 。

下面一步一步看一下是如何解析成语法树的，弄清楚这个之后，就可以灵活实现定制化的实现解析 myxml 。

**解析**

正常情况下，视图描述结构是写在 .myxml 文件里面的，那么首先我们来创建一个 .myxml 文件，如下所示：

![1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/625b3d3f6b9245719ba6f97ef33104a0~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=354&h=92&s=10383&e=png&b=262627)

然后在 myxml 文件中这么写：

![2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/290fd1c8c8cd4f30a24f07b78fa9c746~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1316&h=360&s=47881&e=png&b=1f1f1f)

接下来就需要读取 myxml 文件了，在 text.myxml 同级目录下创建 index.js 文件，然后就需要用 node 提供的 fs 模块读取文件内容了。

```js
const fs = require('fs')
fs.readFile('./text.myxml','utf8',function(err,dataStr){
	console.log(dataStr)
})
```

如上用 fs 提供的 `readFile` 方法异步读取 myxml 文件的内容，在 myxml 中的内容就可以解析出来了，打印内容如下所示：

![3.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/172457a2be794af5b1ea4faa0fe07246~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=858&h=170&s=34538&e=png&b=1f1f1f)

有了文件的字符串内容，就可以解析 wxml 变成对应的语法树结构了。

**如何解析标签结构:**

有了 myxml 文件的内容的字符串结构后，接下来最重要的事情就是解析标签结构了。对于标签结构的解析，可以用一个**栈**的数据结构来解决，栈有这先入先出的特点。具体流程是这样的:

* 首先用遍历的方式，遍历 myxml 字符串，首先用一个栈 stack 来放入搜索解析的的标签，然后用正则匹配到闭合标签的开始和闭合标签的结束。具体正则如下所示：

```js
const startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
const endTagReg = /^<\/([-A-Za-z0-9_]+)[^>]*>/
```

* 如果是闭合标签的开始，比如 `<view>` ，`<view class="root" >` 先把该元素节点放入到栈顶元素的 children 数组中，那么入栈，栈顶元素是最后解析的有效闭合标签的开始。
* 如果是闭合标签的结束，比如 `</view>`，`</text>` ，那么当前的栈顶元素出栈，证明一个标签和内容的元素解析完毕。

比如我们的视图结构如下所示：

```html
<view>
    <view>
        <view></view>
    </view>
</view>
```

那么解析的过程如下图所示：

![4.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0f048669de4416b989f129fa22314f4~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1882&h=1378&s=377614&e=png&b=ffffff)

接下来看一下具体的代码实现：

```js
function myxmlParse(code){
    /* 根节点 */
    let root = {
        tag: "root",
        attr: {},
        children: []
    }
    const stack = []
    let currentRoot = root
    /* 压入栈 */
    const pushStack = (matchRoot) =>{
        matchRoot.children = []
        currentRoot.children.push(matchRoot);
        if (!matchRoot.isSingle) {
            stack.push(matchRoot)
            currentRoot = matchRoot
        }
    }
    /* 移除栈 */
    const popStack = ()=>{
        stack.pop()
        if (stack.length == 0) {
            currentRoot = root
        }else {
            currentRoot = stack[stack.length - 1]
        }
    }

    /* 处理文本 */
    const handleText = (txt='')=>{
        txt = txt.trim()
        if (txt) {
            let currentChilds = currentRoot.children
            /* 如果是文本 */
            if (typeof currentChilds[currentChilds.length - 1] === 'string') {
                currentChilds[currentChilds.length - 1] = currentChilds[currentChilds.length - 1] + txt
            }
            else {
                currentChilds.push(txt)
            }
        }
    }
    workMyxml(code,{
        popStack,handleText,pushStack
    })
    return root
}
```

我们用 myxmlParse 去解析 .myxml 生成的字符串结构，在这个函数中，首先会创建一个 root 节点，一个栈 stack , 还有一个当前最近的节点（栈顶节点）currentRoot ，然后通过 workMyxml 去遍历字符串。在整个遍历阶段：

* 如果匹配到闭合标签的开始，那么会在 workMyxml 中创建一个元素节点，那么调用 pushStack 入栈，将当前元素节点插入到栈顶元素的 children 中。这里有一个问题，就是如果是单标签，比如 `<view />`, 那么需要直接入栈，所以在 workMyxml 遍历的过程，需要增加一个属性 isSingle 来证明是单标签。
* 如果匹配到闭合标签的结束，那么会调用 popStack ,改变栈顶元素。
* 如果是文本，那么会调用 handleText ，那么直接把文本 push 到栈顶元素的 children 中。

知道了通过 stack , pushStack 和 popStack 形成对应的语法树结构，接下来我们看一下是 workMyxml 是如何遍历字符串的。

```js
function workMyxml(myxml, options){
    let preText = ''
    while(myxml){
        /* 找到第一标签 */
        let textFirstIndex = myxml.indexOf('<');
        /* 证明是标签的 */
        if(textFirstIndex === 0){
          //...接下来会讲到
        }
        /* 文本的情况 */
        let text
        //  前端跨端进阶指南</text>
        if (textFirstIndex > 0) {
            // text = 前端跨端进阶指南
            text = preText + myxml.substring(0, textFirstIndex)
            preText = ''
            index += textFirstIndex
            myxml = myxml.substring(textFirstIndex)
        }
        // 前端跨端进阶指南 
        if (textFirstIndex < 0) {
            text = preText + myxml
            preText = ''
            myxml = ''
        }
        // < 
        if (textFirstIndex === 0) {
            preText += myxml[0]
            index += 1
            myxml = myxml.substring(1)
        }
        options.handleText && text && options.handleText(text)
    }
}
```

我们来看一下 workMyxml 的核心逻辑，workMyxml 会遍历整个字符串，通过 `myxml.indexOf('<')` 来找到第一个标签，如果是标签，会走 textFirstIndex === 0 的逻辑。如果不是 0，会判断为文本，接下来截取文本内容，比如上面 myxml 中的 `前端跨端进阶指南` 会被截取出来，然后调用 handleText，插入到第一个栈顶元素的 children 中。

接下来就是重点的标签处理逻辑了。

**注释节点的处理：** 在 myxml 中，会有注释节点，比如如下：

```html
<!-- 注释节点 -->
<view></view>
```

注释是不会被处理成语法树的，对于注释节点，采用的是直接过滤的逻辑，具体流程如下：

```js
/* 注释节点正则 */
const commentReg = /^<!\--/
if (textFirstIndex == 0) {
  if (commentReg.test(myxml)) {
        const commentEndIndex = myxml.indexOf('-->')
        if (commentEndIndex >= 0) {
            index = index + commentEndIndex + 3
            myxml = myxml.substring(commentEndIndex + 3);
            continue
        }
    }
}
```

如果是注释节点，那么直接判断出 --> 的索引 `commentEndIndex`, 然后通过 substring 截取过滤掉注释内容就可以了。

**标签开始处理：** 接下来就是重点的对于标签的处理了，如果是标签，那么会通过正则 startTag 来证明是标签的开始。在解析 myxml 的过程中，还要解析标签里面的属性，比如 `bind:tap="handleClick" class="text {{ customClass }}"` 这个时候需要通过 attrReg ，来正则出标签里面的属性。还要通过 attrRight 来正则出属性值。

```js
const attrReg = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:("(?:\\.|[^"])*")|('(?:\\.|[^'])*')|([^>\s]+)))?/g
const attrRight = /(?:"((?:\\.|[^"])*)")/g
/* 如果是标签开始 */
const startTagMatch = myxml.match(startTag)
if (startTagMatch) {
    index += startTagMatch[0].length
    myxml = myxml.substring(startTagMatch[0].length)
    const tagName = startTagMatch[1] // view
    const rest = startTagMatch[2]  //  bind:tap="handleClick" class="text {{ customClass }}"
    const isSingle = startTagMatch[3] // false
    /* 创建一个元素节点 */
    const newTagNode = {
        tag: tagName, // 类型
        attr: {},   // 属性
        isSingle: !!isSingle, // 是否是单标签
    }
    rest.replace(attrReg, function (match, name, value) {
        let currentValue
        if (value) {
            value.replace(attrRight, (_match1, val) => {
                currentValue = val
            })
        }
        newTagNode.attr[name] = currentValue || true
    })
    if (!isSingle) {
        stack.push(newTagNode)
    }
    /* 把新的元素节点，插入到栈点元素中 */
    options.pushStack && options.pushStack(newTagNode)
    continue
}
```

* 首先通过 **match** 方法，匹配到闭合标签，然后解析出标签类型 **tag** 比如 view text，以及标签的属性 **attr** 比如`bind:tap="handleClick"` ，还有就是是否是单标签 **isSingle**。
* 接下来，创建一个元素节点，通过 replace 正则匹配出所有的标签属性，赋值给 attr 属性。
* 最后通过 pushStack 把新创建的标签元素，放入到 children 属性中。完成整个流程。

**标签结束处理：**

对于闭合标签的结束，通过 endTagReg 匹配出来。然后调用 popStack 就可以了。

**验证：** 接下来验证一下 ast 的生成流程：

```js
let fs = require('fs')
fs.readFile('./text.myxml','utf8',function(err,code){
    console.log(JSON.stringify(myxmlParse(code)))
})
```

结果如下所示：

![5.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24d99fd5c60c4074bc0344d099aa8bef~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=815&h=64&s=17890&e=png&b=1e1e1e)

## 三 transform 转译 AST

完成了解析部分，我们再来看一下转化流程，也就是将我们的 ast 语法树结构，转化成目标代码。在之前的章节中，讲到过在 wxml 中, 运行时的最终形态是渲染函数 render 返回的虚拟 dom 形态，那么以我们今天的例子:

```html
<view bind:tap="handleClick" class="text {{ customClass }}"  >
    <view /> 
    <text  >前端跨端进阶指南</text> 
</view>
```

形成了结构如下所示：

```js
/* 最终的产物 */
const code =  {
    render: function (context){
        return [
            context.createNode('view',{
                props:{ 
                    eventtap:'handleClick',
                    class: `text ${ context.getValue('customClass')}`
                }
            },function(context){
                return [
                    context.createNode('view',null),
                    context.createNode('text' ,null,function(context){
                        return ['前端跨端进阶指南']
                    })
                ]
            } )
        ]
    }
}
```

在运行时阶段，会调用渲染函数生成虚拟 DOM , 虚拟 DOM 的创建，具体是通过 `context.createNode` 产生的虚拟 DOM ，context 为注入的上下文，上面提供了各种方法，比如获取运行时取值的函数 `getValue` 等等。

明白最终产物的样子之后，我们接着第二部分 parse 开始。

```js
const ast = myxmlParse(code)
const code = `const code ={ render: ${myxmlTransfrom(ast)} }`
```

得到 ast 之后，把语法树传入到 myxmlTransfrom，得到目标代码，然后在写入到 JS 中，完成整个流程。

**Transfrom 流程**

Transfrom 的流程实际很简单，就是递归遍历上面的语法树结构 AST ，生成目标代码的过程。在这里其中会根据语法树上的不同节点，不断拼接不同类型的字符串，所以在拼接的过程中，需要一个类来管理拼接好的字符串对象，以及记录代码缩进的状态，并且提供拼接字符串的基本方法。类的样子如下所示：

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
```

如上通过 CodeContext 管理生成的代码:

* code 记录生成的代码。

* indentLevel 记录代码缩的状态，如果没有 indentLevel 我们生成的代码可能长这个样子：  
function (){  
return ...  
}  
这样既影响了美观和代码可读性又非常差。

* 还提供了基础方法，`pushCode`（拼接代码），`newLine`（换行），`indent` 和 `deindent` （换行并缩进的方法）。

**任务拆解：**

接下来就是对目标代码的拆解。首先对于生成的目标代码来说，本质上就是 **children 的解析**，**attr 的解析**，**每一个元素节点的解析**。

children 解析生成：

```js
function (){
    return [
        // 每一个 node 节点
    ]
}
```

元素节点解析生成：

```js
context.createNode(元素标签，元素属性，chidlren解析),
```

元素属性的解析生成：

```js
props:{
    [key]: [view]
}
```

对于整个产物的形成，主要就是这三个部分循环递归就可以了。我们把三个逻辑抽出变成独立的解析函数来处理。先来看看 transfrom 的编写

```js
function transfrom(root){
    const context = new CodeContext()
    /* root 为空指针，root 的 children 为 myxml 中真正的内容 */
    const children = root.children
    generateChildrenFunction(children, context)
    return context.code
}
```

transfrom 传入了 parse 阶段的 ast 语法树，然后创建一个 CodeContext 类，用于生成目标产物代码。我们知道 root 本身是一个哨兵节点，并不是视图内容，真正的内容是哨兵节点的 children 属性，所以直接调用 generateChildrenFunction 来生成 children 函数。

接下来就是重要的 generateChildrenFunction 的核心实现了。

```js
function generateChildrenFunction(nodes, context) {
    context.pushCode(`function (context) {`);
    context.indent();
    context.pushCode("return [");
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i];
      const nextNode = nodes[i + 1];
      //  generateChildrenNode(currentNode, context);
      context.pushCode("这里是children");
      if (nextNode) {
        context.pushCode(", ");
      }
    }
    context.pushCode("];");
    context.deindent();
    context.pushCode("}");
  }
```

可以看到通过 pushCode 等函数的调用，最终可以生成 children 函数的雏形，这里用 `这里是children` 代替了子元素，正常情况下，这里应该是每一个元素节点。

先来看一下产物：

```js
let myxmlTransfrom = require('./transfrom')
let fs = require('fs')
fs.readFile('./text.myxml','utf8',function(err,code){
    const ast = myxmlParse(code)
    const sourceCode = `const code ={ 
 render:${myxmlTransfrom(ast)}  
}`
    console.log(sourceCode)
})
```

终端运行 node parse.js 命令， 结果如下：

![6.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/590d634f7d304e1886421488520e6d28~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=475&h=93&s=9638&e=png&b=1d1d1d)

接下来就是每一个元素节点的解析：

```js
function generateChildrenNode(node,context){
    if(typeof node === 'string'){
        context.pushCode(`"${node}"`)
        return
    }
    context.pushCode(`context.createNode(`);
    context.pushCode(`"${node.tag}", `);
    context.pushCode("{");
    context.indent();
    context.pushCode(`"props":{ `);
    // 标签属性
    //generateAttrNode(node, context);
    context.pushCode("}");
    if (node.children && node.children.length > 0) {
        context.pushCode(`, `);
        generateChildrenFunction(node.children, context);
    }
    context.pushCode(")")
}
```

![7.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22210170a03648bf936e92c0d037eef9~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=549&h=261&s=27581&e=png&b=1d1d1d)

然后来看一下非常重要的属性提取：

```js
function generateAttrNode(node,context){
    if(!node.attr) return 
    const attr = node.attr
    Object.keys(attr).forEach((key,index)=>{
        /* 处理事件 */
        if(key.indexOf('bind:')===0){
            const newkey = key.replace('bind:','event')
            context.pushCode(`"${newkey}": "${attr[key]}"`);
        }else if(/\{\{.*?\}\}/.test(attr[key])){
            /*
           如果  attr[key] 为 text {{ customClass }}
           result = [
                '{{ customClass }}',
                index: 5,
                input: 'text {{ customClass }}',
                groups: undefined
            ]
            */
           const result = attr[key].match(/\{\{.*?\}\}/)  
           const value = result[0].slice(2,-2).trim()
           const code1 = `context.getValue('${value}')`
           const code2 = attr[key].replace(result[0],"${" + code1 + "}" ) // 替换字符串内容
           context.pushCode(`"${key}"`)
           context.pushCode(":")
           context.pushCode("`" + code2 + "`")
        }
        if(index < Object.keys(attr).length -1 ){
            context.pushCode(`,`)
        }
    })
}
```

这里的流程和常规的 wxml 会有区别，因为主要目的是让每位读者明白具体的流程。在 generateAttrNode 中会遍历每一个属性。

* 如果属性的 key 是事件，那么替换成特殊的 event 前缀（这里只是描述语法树的改造过程，实际并不是这么处理的）。
* 如果是动态的 {{}} ，那么会替换掉动态模版里面的内容，用 `context.getValue` 取值函数代替。
* 本质上会有很多指令，比如 wx:if wx:for, 这里也可以在 generateAttrNode 中分别处理。但不是本章节的重点，这里就不过多讲解了。

我们看一下最终的结果：

![8.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58957a2e0e9643d2a8db44cbcc1880d6~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=1704&h=520&s=87190&e=png&b=1e1e1e)

目标函数已经构造完成了，接下来就是把 generate 过程中生成的字符串变成目标文件就可以了。

创建 index.js ， 抽离 parse.js ， transfrom.js 创建 index.js 如下：

![9.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2e0cab96a4c4ad7aac888dcdf788a49~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=344&h=196&s=18788&e=png&b=29292b)

接着在 index.js 文件下，串联整体流程，通过 fs 模块写入文件。

```js
const myxmlParse = require('./parse')
const myxmlTransfrom = require('./transfrom')
let fs = require('fs')
 /* 读取文件 */
fs.readFile('./text.myxml','utf8',function(err,code){
    /* parse 语法树 */
    const ast = myxmlParse(code)
    /* Transfrom + generate 生成目标代码 */
    const sourceCode = `const code ={ 
 render:${myxmlTransfrom(ast)}  
}`
    /* 写入文件 */
    fs.writeFileSync('./source.js',sourceCode)    
})
```

**最终效果展示：**

![10.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e05b07e64f44c0eb2e3f9c5e6df4061~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=2086&h=774&s=167647&e=png&b=1f1f1f)

![11.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa1d44399eaf44c59caa6aa2b3978876~tplv-k3u1fbpfcp-jj-mark:1600:0:0:0:q75.image#?w=642&h=418&s=307402&e=gif&f=66&b=1b1b1b)

## 四 总结

本章介绍了解析 myxml 到生成动态 js 的整体流程，希望读者能够跟上作者的思路，自己实现一遍。

[项目地址](https://github.com/GoodLuckAlien/my-dsl-project "https://github.com/GoodLuckAlien/my-dsl-project") wxml 项目和 dsl 项目在一起