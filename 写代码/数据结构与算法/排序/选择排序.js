// 选出未排序的最小的数字，放到已排序的末尾
function swap1(arr, index1, index2){
  let tmp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = tmp;
}
function sort(arr){
  let flag = 0;
  for(var i=0;i<arr.length;i++){
    let begin = flag;
    let min = arr[begin];
    let minIndex = begin;
    while(begin < arr.length){
      if(min > arr[begin]){
        min = arr[begin]
        minIndex = begin;
      }
      begin++;
    }
    swap1(arr, flag, minIndex)
    flag ++;
  }
  return arr;
}
let arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(sort(arr))