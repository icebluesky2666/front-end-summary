// 思路 先将新的对象原型链关联至原型对象中，再用新对象的this执行构造函数

function myNew(Fn, ...args){
  const obj = Object.create(Fn.prototype);
  const res = Fn.apply(obj, args);
  return (typeof res === 'object' && res != undefined)?res: obj;
}

function Anmials(name){
  this.name = name
}
const cat = myNew(Anmials, '喵')

console.log(cat.name)