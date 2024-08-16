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



