Function.prototype.myapply = function(context = {}, args=[]) {
  const fn = Symbol('');
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
Function.prototype.call = function(context = {}, ...args) {
  const fn = Symbol('');
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
Function.prototype.bind = function(context = {}, ...args) {
  const self = this;
  return function(...innerArgs) {
    return self.call(context,...args,...innerArgs);
  }
}

// 测试
const obj = {
  name: 'John',
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
};
const obj2 = {
  name: 'xiaoming',
}
obj.sayHello.myapply(obj2); // Hello, my name is xiaoming


// 自测

// 手写apply
Function.prototype.My2Apply = function(context, args = []){
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](args)
  delete context[fn];
  return result;
}
// 手写call
Function.prototype.My2Call =  function (context, ...args){
  // this(args)
  const fn = Symbol();
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
// 手写bind
Function.prototype.My2Bind = function (context, args = []){
  const this_ = this;
  return function(...innerArgs){
    return this_.apply(context, [...args, ...innerArgs])
  }
}
Function.prototype.My3Bind = function (context, args = []){
  const this_ = this;
  return function(...innerArgs){
    const fn = Symbol();
    context[fn] = this_;
    const result = context[fn]([...args, ...innerArgs])
    delete context[fn]
    return result;
  }
}

const obj1 = {
  name: 'jon',
  sayName: function(){
    console.log(this.name)
  }
}
const obj12 = {
  name: 'hahaha'
}
obj1.sayName.My2Apply(obj12)
obj1.sayName.My2Call(obj12)
const callback = obj1.sayName.My2Bind(obj12);
callback()
const callback3 = obj1.sayName.My3Bind(obj12);
callback3()