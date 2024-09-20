// 找出数组中唯一的奇数个的数字
function findOnlyOne(arr){
  return arr.reduce((pre, next)=>{
    return pre ^ next
  }, 0)
}
const arr = [1,2,3,4,5,4,3,2,1]
console.log(findOnlyOne(arr));



// 展出数组中唯二的奇数个的数字
function findOnlyTwo(arr){
  // 算出a^b
  const tmp = arr.reduce((pre, next)=>{
    return pre ^ next
  }, 0)
  // 因为a不等于b所以a^b不为0，拿出和res1同位为1的数据进行^
  const tmp1 = tmp & (~tmp + 1)
  let onlyOne = 0;
  arr.forEach(num => {
      if(tmp1 & num){
        onlyOne = onlyOne ^ num;
      }
  });
  // a ^ b ^ a = b
  return [onlyOne, tmp ^ onlyOne]
}
const arr1 = [1,2,3,4,5,6,4,3,2,1]
console.log(findOnlyTwo(arr1));