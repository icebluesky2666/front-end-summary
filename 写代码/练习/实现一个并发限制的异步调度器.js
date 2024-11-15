// 思路是在内部维护一个变量，将每次任务执行的时候判断变量是否超出限制

function Scheduler(max){
  this.num = 0;// 当前执行任务数
  this.max = max;
  this.handler = [];// 当前任务
}
Scheduler.prototype.addTask = function(promiseTask){
  this.handler.push(promiseTask);
  this.start();
}
Scheduler.prototype.start = function(){
  if(this.num >= this.max || this.handler.length <= 0){
    return;
  }
  const task = this.handler.shift();
  this.num = this.num + 1;
  task().then(()=>{
    this.num = this.num - 1;
    this.start();
  })
}
const scheduler = new Scheduler(2);
const addTask = (time, value)=>{
  const task = ()=>{
    return new Promise((resolve, reject)=>{
      setTimeout(()=>{
        resolve(value);
      }, time)
    }).then((value)=>{
      console.log(value)
    })
  }
  scheduler.addTask(task);
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');