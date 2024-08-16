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