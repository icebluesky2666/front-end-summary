// 它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
// 会根据数据的不同，时间复杂度不一样
// 7654321   是O（n2）
// 1234567   是O（n）
// 但是一般都是按照算法可能的最差情况来估计
function quickSort(arr) {
  for(let i=1;i<arr.length;i++){
    let j = i;
    let target = arr[j];
    while(j > 0 && target < arr[j-1]){
      arr[j] = arr[j-1]
      j--;
    }
    arr[j] = target
  }
  return arr;
}
function quickSort1(arr) {
  for(let i=1;i<arr.length;i++){
    for(let j=i-1;j>=0 && arr[j]>arr[j+1];j--){
      arr[j] = arr[j] ^ arr[j+1];
      arr[j+1] = arr[j] ^ arr[j+1];
      arr[j] = arr[j] ^ arr[j+1];
    }
  } 
  return arr;
}
const arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort(arr))
console.log(quickSort1(arr))