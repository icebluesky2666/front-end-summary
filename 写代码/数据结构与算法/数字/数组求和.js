var arr=[1,2,3,[[4,5],6],7,8,9]
let arr1= arr.toString().split(',').reduce( (total,i) => total += Number(i),0);
let arr2 = arr.flat(Infinity).reduce((old,pre)=>{return pre = pre + old},0);
console.log(arr1, arr2)