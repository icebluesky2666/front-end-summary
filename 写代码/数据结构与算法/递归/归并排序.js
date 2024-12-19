// 取中点，左侧排序，右侧排序，然后进行merge操作
// 2*T(n/2)+O(n)
// a = 2 ,b=2,d=1
// log(2,2) = 1 
// logN * N



// 归并排序
function guibin(arr,left,right){
  if(arr.length <= 1) return arr;
  let middle = Math.floor(arr.length / 2);
  const leftArr = arr.slice(0, middle);
  const rightArr = arr.slice(middle);
  return merge(guibin(leftArr), guibin(rightArr));
}
function merge(arr1, arr2){
  const res = [];
  while(arr1.length > 0 && arr2.length > 0){
    res.push(arr1[0] < arr2[0]?arr1[0]:arr2[0]);
    if(arr1[0] < arr2[0]){
      arr1.shift();
    }else{
      arr2.shift();
    }
  }
  return res.concat(arr1.length?arr1:arr2)
}
const arr = [1,6,4,9,0,5,3,5,8,7,6]
// console.log(quickSort(arr))
// console.log(quickSort2(arr))
console.log(guibin(arr))
// 小和问题：将任何左侧数字比右侧数字小的数相加
// 逆顺对问题：只有左侧比右侧大就构成一个逆序对，求有多少个逆序对


