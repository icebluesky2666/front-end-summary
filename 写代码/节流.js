function debounce(fn, delay) {
  let timer = null;
  const context = this;
  return function(){
    if(timer) return;
    timer = setTimeout(()=>{
      fn.apply(context, arguments);
    }, delay)
  }
}
// 测试
function sayHello() {
  console.log('Hello World');
}
// const debouncedSayHello = debounce(sayHello, 1000);
// debouncedSayHello();
// debouncedSayHello();
// debouncedSayHello();
// debouncedSayHello();

// 自测
function debounce1(fn,time){
  const that = this;
  let timer = null;
  return function(...args){
    if(timer) return;
    timer = setTimeout(()=>{
      fn.apply(that, args);
      timer = null;
    },time )
  }
}
const debouncedSayHello1 = debounce1(sayHello, 1000);
debouncedSayHello1();
debouncedSayHello1();
debouncedSayHello1();
debouncedSayHello1();
setTimeout(()=>{
  console.log('----')
  debouncedSayHello1();
}, 3000)