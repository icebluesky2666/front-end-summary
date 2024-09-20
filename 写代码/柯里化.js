function add(a ,b, c){
  return a + b + c;
}

function curry(fn){
  return function curryed(...args){
    console.log(args.length , fn.length )
    if(args.length >= fn.length){
      return fn.apply(this, args);
    }else{
      // 收集参数
      return function (args2){
        return curryed.apply(this, args.concat(args2));
      }
    }
  }
}

// 例子add(1,2,3);改造成add(1)(2)(3)
console.log(curry(add)(1)(2)(3))

// 自测柯里化
function curry1(fn){
  const that = this;
  return function func(...args){
    if(args.length >= 3){
      return fn.apply(that, args)
    }else{
      return function(...callArgs){
        return func.apply(that, [...args, ...callArgs])
      }
    }
  }
}
function curry2(fn){
  const that = this;
  let args_ = [];
  const add = function func(...args){
    args_ = args_.concat(args);
    if(args_.length >= fn.length){
      return fn.apply(that, args_)
    }else{
      return add;
    }
  }
  return add;
}


console.log('自测1：',curry1(add)(1)(2)(3))
console.log('自测2：',curry2(add)(1)(2)(3))

// 实现一个函数满足如下条件
// add(1)(2)(3)
// add(1,2)(3)
// add(1,2)(3)(4,5),(6)...

function add(){
  let args_ = [];
  const result = function(...args){
    args_ = args_.concat(args)
    return result;
  }
  result.toString = function(){
    return args_.reduce((a,b)=>{
      return a+b
    },0)
  }
  return result
}
console.log(add(1)(2)(3).toString())
console.log(add(1,2)(3).toString())
console.log(add(1,2)(3)(4,5)(6).toString())


