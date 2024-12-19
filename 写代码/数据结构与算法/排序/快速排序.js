// 快排的原理如下。随机选取一个数组中的值作为基准值，从左至右取值与基准值对比大小。比基准值小的放数组左边，大的放右边，对比完成后将基准值和第一个比基准值大的值交换位置。然后将数组以基准值的位置分为两部分，继续递归以上操作
const arr = [1,6,4,9,0,5,3,5,8,7,6]
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
// 快速排序
// 版本1：借助其他的空间导致整个空间复杂度较高
function quickSort1(arr){
  if(arr.length <= 1){
    return arr;
  }
  let base = arr[0];
  let left = [];
  let right = [];
  let equie = [];
  for(let i=0; i<arr.length; i++){
    if(arr[i] > base){
      right.push(arr[i]);
    }
    if(arr[i] == base){
      equie.push(arr[i]);
    }
    if(arr[i] < base){
      left.push(arr[i]);
    }
  }
  return [...quickSort1(left),...equie, ...quickSort1(right)]
}
// console.log('版本1:',quickSort1(arr))

// 版本2: 利用原有空间
// 小于区放在数组左边, 大于区在数组右边, 当前数从0开始, 有3种可能:
// 1) 当前数<P, 当前数跟小于区的下一个数交换, 小于区向右扩, 当前数跳到下一个
// 2) 当前数>P, 当前数跟大于区的前一个数交换, 大于区向左扩, 当前数不动
// 3) 当前数=P, 当前数直接跳下一个

// 当前数跟大于区域的边界撞上的时候不用遍历了
// 最后一个数 跟 大于区域的第一个数交换就做到了
// <P的整体放在左边, =P的整体放在中间, >P的整体放在右边
function swap(arr, index1, index2){
  // arr[index1] = arr[index1] ^ arr[index2]
  // arr[index2] = arr[index1] ^ arr[index2]
  // arr[index1] = arr[index1] ^ arr[index2]
  let tmp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = tmp;
}
function partition(arr, left, right){
  if(left >= right){
    return;
  }
  let base = arr[right];
  let leftIndex = left;
  let rightIndex = right;
  let i = left;
  while(i <= rightIndex){
    if(arr[i] < base){
      swap(arr, i, leftIndex);
      leftIndex ++;
      i++;
    }
    if(arr[i] > base){
      swap(arr, i, rightIndex);
      rightIndex --;
    }
    if(arr[i] === base){
      i++;
    }
  }
  return [leftIndex, rightIndex]
}
function sort(arr, left, right){
  if (left >= right){  
    return;  
  } 
  swap(arr, left + parseInt((Math.random() * (right - left + 1))), right); 
  const [leftIndex, rightIndex] = partition(arr, left, right);
  sort(arr, left, leftIndex);
  sort(arr, rightIndex + 1, right);
}
function quickSort2(arr){
  if(arr.length < 2){
    return;
  }
  sort(arr, 0, arr.length-1);
  return arr;
} 
// let testData = [3,4,1,1,1,3,3,6,3]
let testData = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort2(testData))
