function quickSort(arr) {
  for(let i=0;i<arr.length;i++){
    for(let j=0;j<arr.length-i-1;j++){
      if(arr[j] > arr[j+1]){
        let tmp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = tmp;
      }
    }
  }
  return arr;
}

const arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort(arr))