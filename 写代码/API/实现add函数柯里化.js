// add(1);             // 1
// add(1)(2);      // 3
// add(1)(2)(3)；// 6
// add(1)(2, 3); // 6
// add(1, 2)(3); // 6
// add(1, 2, 3); // 6

function add(...args){
  if(args.length >= 3){
    return args.reduce((old,next)=> old+next, 0)
  }else{
    return function(...arg){
      return add.apply(this, [...arg,...args])
    }
  }
}

// 参数固定
function add1(...args){
  const this_ = this;
  if(args.length>3){
    return args.reduce((a,b)=> a + b, 0)
  }else{
    return function(...arg2){
      return add1.apply(this_, [...args,...arg2])
    }
  }
}
// console.log(add(1))
// console.log(add(1)(2))
console.log(add(1)(2)(3))
console.log(add(1)(2, 3))
console.log(add(1, 2)(3))
