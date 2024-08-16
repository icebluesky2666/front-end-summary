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