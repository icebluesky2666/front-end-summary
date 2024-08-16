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
const debouncedSayHello = debounce(sayHello, 1000);
debouncedSayHello();
debouncedSayHello();
debouncedSayHello();
debouncedSayHello();