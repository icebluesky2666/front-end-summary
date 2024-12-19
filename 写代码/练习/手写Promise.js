// 思路内部维护一个状态，错误值，正确值，错误处理函数数组，正确处理函数数组，用类似于观察者模式的思路去实现

function Mypromise(fn){
  this.value = null;
  this.errorValue = null;
  this.state = 'pending';
  this.handler = [];
  this.errHandler = [];

  this.resolve = (value)=>{
    this.value = value;
    this.state = 'fulfilled';
    (this.handler || []).forEach((callback)=>{
      callback?.(this.value)
    })
  }

  this.reject = (value)=>{
    this.errorValue = value;
    this.state = 'reject';
    (this.errHandler || []).forEach((callback)=>{
      callback?.(this.errorValue)
    })
  }

  this.then = (resolve, reject)=>{
    if(this.state === 'fulfilled'){
      this.handler.push(resolve)
    }
    if(this.state === 'reject'){
      this.errHandler.push(reject)
    }
    if(this.state === 'pending'){
      this.handler.push(resolve);
      this.errHandler.push(reject)
    }
  }
  fn(this.resolve, this.reject);
}

new Mypromise((resolve,reject)=>{
  setTimeout(()=>{
    reject(1)
  }, 1000)
}).then((value)=>{
  console.log('正确结果：',value)
},(value)=>{
  console.log('错误结果：',value)
})

function Mypromise1(fn){
  this.satus = 'panding'
  this.res = null;
  this.errorRes = null;
  this.handler = [];
  this.errHandler = [];

  const resolve = function (data){
    this.satus = 'resolve'
    this.res = data;
    ([] || this.handler).forEach((handler)=>{
      handler();
    })
  }
  const reject = function (errData){
     this.satus = 'reject'
    this.errorRes = errData;
    ([] || this.errHandler).forEach((handler)=>{
      handler();
    })
  }
  fn(resolve, reject);
}
Mypromise1.prototype.then = function(res, rej){
  if(this.satus === 'resolve'){
    this.handler.push(res)
  }else if(this.satus === 'reject'){
    this.errHandler.push(rej)
  }else{
    this.handler.push(res)
    this.errHandler.push(rej)
  }
}