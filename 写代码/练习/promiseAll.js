

const promise1 = new Promise((res, rej)=>{
  setTimeout(()=>{
    res(1)
  },[1])
})
const promise2 = new Promise((res, rej)=>{
  setTimeout(()=>{
    rej('none')
  },[2])
})

Promise.myall = function(arr = []){
  let res = [];
  let nums = 0;
  return new Promise((resolve, reject)=>{
    for(let i=0;i<arr.length;i++){
      if(arr[i]){
        arr[i].then((data)=>{
          res[i] = data;
          if(++nums >= arr.length){
            resolve(res);
          }
        }).catch((err)=>{
          reject(err)
        })
      }
    }
  })
}
Promise.myall([promise1, promise2]).then((data)=>{
  console.log(data)
}).catch((err)=>{
  console.log(err)
})