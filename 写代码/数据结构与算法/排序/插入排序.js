// 它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
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

const arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort(arr))