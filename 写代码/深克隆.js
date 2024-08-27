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