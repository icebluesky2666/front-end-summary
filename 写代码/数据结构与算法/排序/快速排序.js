// 快排的原理如下。随机选取一个数组中的值作为基准值，从左至右取值与基准值对比大小。比基准值小的放数组左边，大的放右边，对比完成后将基准值和第一个比基准值大的值交换位置。然后将数组以基准值的位置分为两部分，继续递归以上操作
function quickSort(arr) {
  if (arr.length<=1){
    return arr;
  }
  var baseIndex = Math.floor(arr.length/2);//向下取整，选取基准点
  var base = arr[baseIndex];

  let left = [];
  let right = [];
  for(let i=0;i<arr.length;i++){
    if(i === baseIndex) continue;
    if(arr[i] < base){
      left.push(arr[i])
    }else{
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([base]).concat(quickSort(right));
}

const arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort(arr))