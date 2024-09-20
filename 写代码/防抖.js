function debounce(fn, delay) {
  let timer = null;
  const context = this;
  return function(){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
      fn.apply(context, arguments);
    }, delay)
  }
}
// 测试
function sayHello(x) {
  console.log('Hello World = ', x);
}
// const debouncedSayHello = debounce(sayHello, 1000);
// debouncedSayHello();
// debouncedSayHello();
// debouncedSayHello();
// debouncedSayHello();

// 自测
function debounce2(fn, time){
  const that = this;
  let timer = null;
  return function(...args){
    if(timer){
      clearTimeout(timer)
      timer = null;
    }
    timer = setTimeout(()=>{
      fn.apply(that, args);
    }, time)
  }
}
const debouncedSayHello1 = debounce2(sayHello, 1000);
debouncedSayHello1(1);
debouncedSayHello1(2);
debouncedSayHello1(3);
debouncedSayHello1(4);
setTimeout(()=>{
  console.log('----')
  debouncedSayHello1(5);
}, 3000)