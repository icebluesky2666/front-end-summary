// 代理模式思路是代理的接口和目标接口往往是相同的

// 缓存计算结果
function add(){
  let result = 0;
  for (let i in arguments){
    result = arguments[i] + result
  }
  return result;
}

const proxyAdd = (() =>{
  const cache = {};
  return function(...args){
    const key = Array.prototype.join.call(args, ',');
    if(cache[key]){
      console.log('我是从缓存取的，我的key是：', key);
      return cache[key]
    }else{
      cache[key] = add(...args);
      return cache[key]
    }
  }
})()

console.log(proxyAdd(1,2,3))
console.log(proxyAdd(1,2,3))