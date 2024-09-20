const P = new Promise((resolve, reject)=>{
  resolve('resolve');
  reject('reject');
  // throw Error('error')
  setTimeout(()=>{
    console.log(111)
  })
  return
});

P.then((data)=>{
  console.log(data)
}).catch((e)=>{
  console.log(e)
})