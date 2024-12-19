
function Scheduler1(limit){
  this.limit = limit;
  this.num = 0;
  this.tasks = [];
}
Scheduler1.prototype.addTask = function(task){
  this.tasks.push(task);
  this.run();
}
Scheduler1.prototype.run = function(){
  if(this.num < this.limit &&  this.tasks.length > 0){
    let task = this.tasks.shift()
    this.num = this.num + 1;
    task().then(()=>{
      this.num = this.num - 1;
      this.run();
    })
  }
}


const sche = new Scheduler1(2);
function addTask(delay, data){
  let task = ()=>{
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(data)
      }, delay)
    }).then((res)=>{
      console.log(res)
    })
  }
  sche.addTask(task)
}

addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');