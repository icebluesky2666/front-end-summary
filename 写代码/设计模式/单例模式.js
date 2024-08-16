// 一个类只能构造出唯一实例


// 方案一: 高阶函数必包维护一个result
function createApp(name) {
  this.name = name;
}
createApp.prototype.getName = function() {return this.name};

function getSingleFunc(fn) {
  let result = null;
  return function(...args) {
    if(result === null) {
      result = fn.apply(this, args);
    } 
    return result;
  }
}
var aa = getSingleFunc(createApp)('haha');
var bb = getSingleFunc(createApp)('qwe');
console.log('a === b ?', aa === bb); // true
// 函数上挂载getInstance方法

function createApp2(name) {
  this.name = name;
}
createApp2.instance = null;
createApp2.prototype.getName = function() {return this.name};
createApp2.getInstance = function(name) {
  if (!createApp2.instance) {
    createApp2.instance = new createApp2(name);
  }
  return createApp2.instance;
}
// class实现代理劫持constructor
class App {
  static instance = null;
  constructor(name) {
    if(App.instance){
      return App.instance;
    }
    this.name = name;
    App.instance = this;
  }
  getName() {
    return this.name;
  }
}
let a = new App('App1');
let b = new App('App1');
console.log(a === b); // true
// 代理劫持方案