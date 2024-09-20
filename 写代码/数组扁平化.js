// const flattenArray = (arr) => {
//   return arr.reduce((old, pre)=>{
//     if(Array.isArray(pre)){
//       return [...old, ...flattenArray(pre)]
//     }else{
//       return [...old, pre]
//     }
//   },[])
// }
const flattenArray = (arr) => {
  let result = [];
  arr.forEach(element => {
    if(element instanceof Array){
      result = result.concat(flattenArray(element))
    }else{
      result = result.concat(element)
    }
  });
  return result;
}
let arr = [1, [2, [3, 4], 5], 6]
console.log(flattenArray(arr))

// 自测
// 方法一
const flattenArray1 = function(arr){
  return arr.reduce((old, pre)=>{
    if(Array.isArray(pre)){
      return [...old, ...flattenArray1(pre)]
    }else{
      return [...old, pre]
    }
  },[])
}
// 方法二
const flattenArray2 = function(arr){
  let res = []
  for(let i=0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
      res = res.concat(flattenArray2(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res;
}
// 方法三
const flattenArray3 = function(arr){
  return arr.flat(Infinity)
}
console.log('方法一:',flattenArray1(arr))
console.log('方法二:',flattenArray2(arr))
console.log('方法三:',flattenArray3(arr))
