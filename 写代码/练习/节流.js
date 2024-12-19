// 节流的思路是在用户重复点击的时候，判断是否已经有timeout在执行了，如果有就取消
function throttling(handler, timeout){
  this.timer = null;
  const _this = this;
  return function(){
    if(!this.timer){
      handler.apply(_this, arguments);
      this.timer = setTimeout(()=>{
        clearTimeout(this.timer);
        this.timer = null;
      },timeout)
    }
  }
}
// test
const testFun = ()=>{
  console.log('节流...')
}
const throttlFn = throttling(testFun, 1000);

throttlFn();
throttlFn();
throttlFn();
throttlFn();
setTimeout(()=>{
  throttlFn();
},2000)

function throttling1(fn, delay){
  let timer = null;
  let _this = this;
  return function(){
    if(timer) return;
    timer = setTimeout(()=>{
      fn.apply(_this, arguments)
    }, delay)
  }
}