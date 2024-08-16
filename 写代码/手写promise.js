function myPromise(fn){
  this.value = null;
  this.errValue = null;
  this.state = 'pending';
  this.handllers = [];
  this.errorHandllers = [];
  // 成功
  const resolve = (value) => {
    if(this.state === 'pending'){
      this.state = 'fulfulled'
      this.value = value;
      if(this.handllers.length > 0){
        this.handllers.forEach(handler => handler(this.value))
      }
    }
  }
  // 失败
  const reject = (value) => {
    if(this.state === 'pending'){
      this.state = 'rejected'
      this.errValue = value;
      if(this.errorHandllers.length > 0){
        this.errorHandllers.forEach(handler => handler(this.errValue))
      }
    }
  }
  fn(resolve, reject);

  this.then = (onFulfilled, onRejected) => {
    if(this.state === 'filfelled'){
      onFulfilled(this.value)
    }
    if(this.state === 'rejected'){
      onRejected(this.errValue)
    }
    if(this.state === 'pending'){
      this.handllers.push(onFulfilled)
      this.errorHandllers.push(onRejected)
    }
  }
}

// 测试
new myPromise((res, rej)=>{
  setTimeout(() =>{
    res(5)
  }, 2000);
}).then((value)=>{
  console.log('value:', value)
})