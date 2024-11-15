// 思路，使用set自动处理，逐一比较
function getSetArray(arr){
  return Array.from(new Set(arr));
}
function getSetArray2(arr){
  return arr.reduce((a,b)=>{
    return a.includes(b)?a:a.concat(b)
  },[])
}
const a = [1,2,2,5,5,7];
console.log(getSetArray(a));
console.log(getSetArray2(a));