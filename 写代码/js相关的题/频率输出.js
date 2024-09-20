function createRepeat(fn, repeat, interval) {
  let times = 0;
  let intervalObj = null;
  return function(data){
    intervalObj = setInterval(()=>{
      if(times <= repeat){
        fn(data);
        times++;
      }else{
        clearInterval(interval);
      }
    }, interval * 1000)
  }
}

const fn = createRepeat(console.log, 3, 4);

fn('helloWorld');