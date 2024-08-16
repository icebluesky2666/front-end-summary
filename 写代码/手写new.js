function myNew(fn){
  // 创建一个新对象,原型连接到构造的原型上
  var obj = Object.create(fn.prototype);
  // 执行构造函数, 并将this绑定到新创建的对象上
  var result = fn.apply(obj, Array.from(arguments).slice(1))
  // 如果构造函数返回的是一个非空对象, 那么返回这个新创建的对象
  return typeof result === 'object' && result !== null? result : obj;
}
// test
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.sayHello = function() {
  console.log('Hello, my name is ' + this.name);
};
var p = myNew(Person, 'John', 25);
p.sayHello(); // Hello, my name is John