function getSimArray(arr){
  return Array.from(new Set(arr))
}

const arr = [1, 2, 3, 2, 4, 5, 5 , 6, 6,]
console.log(getSimArray(arr))

// 自测
const arr1 = [1, 2, 3, 2, 4, 5, 5 , 6, 6,]
// 方法一
const Res = Array.from(new Set(arr1))
console.log(Res)
// 方法二
const Res1 = [];
arr1.forEach((value)=>{
  if(!Res1.includes(value)){
    Res1.push(value)
  }
})
console.log(Res1)