// 找出数组中唯一的奇数个的数字
function findOnlyOne(arr){
  return arr.reduce((pre, next)=>{
    return pre ^ next
  }, 0)
}
const arr = [1,2,3,4,5,4,3,2,1]
console.log(findOnlyOne(arr));



// 展出数组中唯二的奇数个的数字11010 00110 00010
function findOnlyTwo(arr){
  // 算出a^b
  const tmp = arr.reduce((pre, next)=>{
    return pre ^ next
  }, 0)
  // 因为a不等于b所以a^b不为0，拿出和res1同位为1的数据进行^
  const tmp1 = tmp & (~tmp + 1)// 右侧第一个为1的数字
  let onlyOne = 0;
  arr.forEach(num => {// 因为00010异或其他的只有第二位为0才存在，又因为两个数字异或第二位为1，所以两个数字必有一个满足一个不满足
      if(tmp1 & num){
        onlyOne = onlyOne ^ num;
      }
  });
  // a ^ b ^ a = b
  return [onlyOne, tmp ^ onlyOne]
}
const arr1 = [1,2,3,4,5,6,4,3,2,1]
console.log(findOnlyTwo(arr1));