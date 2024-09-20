function deepClone(obj){
  // 判断是否是object，不是的话直接返回
  if(typeof obj !== 'object'){
    return obj;
  }
  // object的话判断是数组还是对象
  let res = obj instanceof Array ? [] : {};
  for(let i in obj){
    if(obj.hasOwnProperty(i)){
      res[i] = typeof obj[i] !== 'object'?obj[i]: deepClone(obj[i]);
    }
  }
  return res;
}

let data = {
  name: 'xiaoming',
  age: 18,
  msg: {
    num: 1234
  }
}
const dataCopy = deepClone(data);
console.log(dataCopy)

// 自测深克隆
function cloneDeep(obj){
  // 判断是否是对象
  if(typeof obj !== 'object'){
    return obj;
  }
  // 创建新对象
  const cloneObj = Array.isArray(obj)?[]:{}
  // 复制属性
  for(let i in obj){
    if(obj.hasOwnProperty(i)){
      if(typeof obj[i] === 'object'){
        cloneObj[i] = cloneDeep(obj[i]);
      }else{
        cloneObj[i] = obj[i];
      }
    }
  }
  return cloneObj;
}


const obj1 = {
  name: 'jon',
  detail: {
    age: 18,
  },
  sayHello: function(){
    console.log(this.name);
    return this.name;
  }
}
const obj2 = cloneDeep(obj1);
console.log(obj2.name, obj2.detail, obj2.sayHello())