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
// console.log(add(1))
// console.log(add(1)(2))
console.log(add(1)(2)(3))
console.log(add(1)(2, 3))
console.log(add(1, 2)(3))
