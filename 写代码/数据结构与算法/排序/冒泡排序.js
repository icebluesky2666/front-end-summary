
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


function quickSort2(arr) {
  for(let i=arr.length-1;i>=0;i--){
    for(j=0;j<i;j++){
      if(arr[j] > arr[j+1]){
        arr[j] = arr[j] ^ arr[j+1];
        arr[j+1] = arr[j] ^ arr[j+1]
        arr[j] = arr[j] ^ arr[j+1]
      }
    }
  }
  return arr;
}

const arr = [1,6,4,9,0,5,3,5,8,7,6]
console.log(quickSort(arr))
console.log(quickSort2(arr))