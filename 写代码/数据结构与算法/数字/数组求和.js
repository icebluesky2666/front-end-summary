var arr=[1,2,3,[[4,5],6],7,8,9]
let arr1= arr.toString().split(',').reduce( (total,i) => total += Number(i),0);
let arr2 = arr.flat(Infinity).reduce((old,pre)=>{return pre = pre + old},0);
console.log(arr1, arr2)

function getArr(arr){
  let res = [];
  for(let i=0; i<arr.length; i++){
    if(Array.isArray(arr[i])){
      res = res.concat(getArr(arr[i]));
    }else{
      res = [...res, arr[i]]
    }
  }
  return res;
}
function getArr2(arr){
  return arr.reduce((pre, cur)=>{
    if(Array.isArray(cur)){
      return [...pre, ...getArr2(cur)]
    }else{
      return [...pre, cur]
    }
  },[])
}
console.log(getArr(arr))
console.log(getArr2(arr))