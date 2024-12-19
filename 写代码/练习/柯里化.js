// 柯里化的思路是将每次的请求进行闭包保存，在合适的时候进行函数执行
// 将add(1,2,3)改成add(1)(2)(3)

function add(a,b,c){
  console.log(a+b+c);
  return a+b+c
}
function currying(fn){
  const _this = this;
  return function tmp(){
    if(arguments.length >= fn.length){
      fn.apply(_this, arguments)
    }else{
      const argumentsOld = arguments;
      return function(){
        return tmp(...argumentsOld, ...arguments)
      }
    }
  }
}

//currying(add)(1)(2)(3);

// 还有一种函数要求 add(1,2,3) add(1)(2)(3) add(1,2)(3)都可以

function addCurring(){
  let args_ = [];
  const result = function(...args){
    args_ = args_.concat(args);
    return result;
  }
  result.toString = function() {
    return args_.reduce((a, b)=>{
      return a + b
    }, 0)
  }
  return result;
}

console.log(addCurring(1,2,3,4).toString())
console.log(addCurring(1,2)(3,4).toString())


// 将add(1,2,3)改成add(1)(2)(3)
function currying(fn){
  const _this = this;
  return function tmpFn(){
    if(arguments.length > fn.length){
      fn.apply(_this, arguments)
    }else{
      const argumentsOld = arguments;
      return function(){
        return tmpFn([...argumentsOld, ...arguments])
      }
    }
  }
}
// 还有一种函数要求 add(1,2,3) add(1)(2)(3) add(1,2)(3)都可以
function addCurring(){
  const args = [];
  const res = function(){
    args = args.concat(arguments);
    return res;
  }
  res.prototype.toString = function(){
    return args.reduce((a, b)=>{
      return a+b
    },0)
  }
  return res;
}