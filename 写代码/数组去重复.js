function getSimArray(arr){
  return Array.from(new Set(arr))
}

const arr = [1, 2, 3, 2, 4, 5, 5 , 6, 6,]
console.log(getSimArray(arr))