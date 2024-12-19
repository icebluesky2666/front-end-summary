// 思路是先判断是不是i基础数据类型，再判断是否是数组
function deepClone(obj){
  if(typeof obj !== 'object'){
    return obj;
  }
  const res = Array.isArray(obj)?[]:{};
  const keys = Object.keys(obj);
  (keys || []).forEach((key)=>{
    if(obj.hasOwnProperty(key)){
      res[key] = typeof obj !== 'object'?obj[key]:deepClone(obj[key]);
    }
  })
  return res;
}


// test
const obj1 = {a:1,b:{name: '小明'}};
const obj2 = deepClone(obj1);
console.log(obj2)


function deepClone1(obj){
  if(typeof obj !== 'object'){
    return obj;
  }
  const res = Array.isArray(obj)?[]:{};
  ([] || Object.keys(obj)).forEach((key)=>{
    if(obj.hasOwnProperty(key)){
      res[key] = typeof obj[key] === 'object'?deepClone1(obj[key]):obj[key];
    }
  })
  return res;
}