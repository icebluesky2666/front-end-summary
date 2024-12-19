
function test(digit, callback) {
  setTimeout(() => {
      callback(null, digit + 1);
  }, 100);
}
// test(1, console.log);

// 改为promise

function promisify(fn){
  return function(args){
    return new Promise((resolve, reject)=>{
      try {
        console.log('==',args)
        fn(args, (a, b)=>{
          resolve(b)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
const promiseTest = promisify(test);
promiseTest(1).then(console.log, console.error);