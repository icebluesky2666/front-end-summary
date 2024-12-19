// 利用对象调用this指向原理将原来函数通过新的this执行

// apply
Function.prototype.myApply = function(context, args = []) {
  const tmp = Symbol('');
  context[tmp] = this;
  const result = context[tmp](...args);
  delete context[tmp];
  return result;
}
// call
Function.prototype.myCall = function(context, ...args){
  const tmp = Symbol('');
  context[tmp] = this;
  const result = context[tmp](...args)
  delete context[tmp];
  return result;
}
// bind
Function.prototype.myBind = function(context, args = []){
  const _this = this;
  return function(){
    const tmp = Symbol('');
    context[tmp] = _this;
    const result = context[tmp](...args);
    delete context[tmp];
    return result;
  }
}

// text
const a = {
  value: 1,
  showValue: function(){
    console.log(this.value);
  }
}
const b = {value: 2};
a.showValue.myApply(b)
a.showValue.myCall(b)
a.showValue.myBind(b)();

Function.prototype.myApply = function(context, args = []){
  const sy = Symbol('');
  context[sy] = this;
  const res = context[sy](...args);
  delete context[sy];
  return res;
}



