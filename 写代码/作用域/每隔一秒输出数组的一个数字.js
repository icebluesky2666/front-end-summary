var arr = [1,2,3,4,5,];
// 递归
// function handllerPop(arr){
//   setTimeout(()=>{
//     console.log(arr[0]);
//     arr.shift()
//     if(arr.length > 0){
//       handllerPop([...arr])
//     }
//   }, 1000)
// }

// while
function log(num){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      console.log(num);
      resolve();
    },1000)
  })
}
async function handllerPop(arr){
  while(arr.length > 0 ){
    await log(arr[0])
    arr.shift();
  }
}
handllerPop(arr)



