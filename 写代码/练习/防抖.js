// debounce 防抖的原理是在函数调用的时候，如果有历史的调用任务没执行，则更新调用任务，开启新的周期
function debounce(handler, delay){
  this.timer = null;
  const _this = this;
  return function(){
    if(this.timer){
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(()=>{
      handler.apply(_this, arguments)
    }, delay)
  }
}
const testFn = (i)=>{console.log('防抖...' , i)};
const debounceFn = debounce(testFn, 1000);
for(let i=0;i<10;i++){
  debounceFn(i);
}
