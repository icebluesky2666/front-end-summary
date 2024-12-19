// 一种是直接用flat，还有就是使用递归的方案
function getBpArr(arr){
  return arr.flat(Infinity);
}
function getBpArr2(arr){
  return arr.reduce((a, b)=>{
    return Array.isArray(b)?a.concat(getBpArr2(b)):a.concat(b);
  }, [])
}
const a = [1,2,[3,4,[5]]]
console.log(getBpArr(a))
console.log(getBpArr2(a))


function BParr(arr){
  // return arr.flat(Infinity);
  return arr.reduce((a, b)=>{
    let b1 = Array.isArray(b)? BParr(b):b;
    return a.concat(b);
  },[])
}
function BParr1(arr){
  const res = [];
  for(let i=0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
      res = res.concat(BParr1(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res;
}