// x是对象的引用，属性值会更改
function a(x){
  x.a = x.a + 1;
}
let b = {
  a: 1
}
a(b);
console.log(b)



// 前端有函数作用域，内部的数据从新定义
var q = 1;
var change = () => {
  var q = 2;
  console.log(q)
}
change();
console.log(q)

// 1,2,4,haha,start,end,3
let p = new Promise((res, rej)=>{
  console.log(1)
  setTimeout(()=>{
    console.log('start')
    res('ok')
    console.log('end')
  },0)
  console.log(2)
})
p.then((value)=>{
  console.log(3)
})
let x = Promise.resolve(3).then(()=>{
  console.log('haha')
})
console.log(4)


