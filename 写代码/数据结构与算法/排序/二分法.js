// 查找有序数组，某个数字的下标
function findNum(num, arr){
  let start = 0;
  let end = arr.length - 1;
  let res = null;
  while(start <= end){
    const tmp = parseInt((start + end)/2)
    if(arr[tmp] === num){
      res = tmp;
      break;
    }else if(arr[tmp] > num){
      end = tmp - 1;
    }else{
      start = tmp + 1;
    }
  }
  return res;
}
const arr = [1,2,3,4,5,88,89,90,91,92]
console.log(findNum(92, arr));

// 查找有序数组，大于等于一个数最左侧的位置【1，2，3，4，5，6，6，7，8，8，9，9，9，9，9，9，9】
function findNum2(num, arr){
  let start = 0;
  let end = arr.length - 1;
  let res = null;
  while(start <= end && arr[end] >= num){
    tmp = parseInt((end + start)/2)
    if(arr[tmp] >= num){
      res = tmp;
      end = tmp - 1;
    }else{
      start = tmp + 1
    }
  }
  return res
}
const arr2 = [1,2,3,4,5,88,89,90,91,92]
console.log(findNum2(5, arr2));

// 局部最小，相邻数字不同，0位置小于1位置，n位置小于n-1位置，中间的小于两边的，问有没有一个方法在优于O（n）的情况下，找到局部最小
function getAreaMinNum(arr){
  if(arr[0]<arr[1]) return 0;
  if(arr[arr.length -1] < arr[arr.length - 2]) return arr.length -1;
  // 中间的情况
  let left = 1;
  let right = arr.length -2;
  let res = null;
  while(left <= right){
    const tmp = parseInt((left + right)/2);
    if(arr[tmp] < arr[tmp-1] && arr[tmp] < arr[tmp+1]){
      res = tmp;
      break;
    }
    if(arr[tmp] < arr[tmp-1] && arr[tmp] > arr[tmp+1]){
      left = tmp + 1;
    }else{
      right = tmp - 1;
    }
  }
  return res;
}
const arr3 = [15,14,3,2,1,88,89,88,91,92]
console.log(getAreaMinNum(arr3));

