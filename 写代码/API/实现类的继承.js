function Parent(){
  this.a = 1;
}
function Child(){
  Parent.call(this);
  this.a = 1;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 复习new
function MyNew(Pro, ...args){
  // 链接原型链
  let obj = Object.create(Pro.prototype);
  // 执行构造函数
  let res = Pro.call(obj, ...args);
  return typeof res === 'object'?res:obj

}
