// 总结 实现思路就是谁是被订阅者，谁维护一个数组，数组里面是观察实例对象或者函数无所谓

// 发布订阅是提供了一个事件总线
// 观察者是表明了一对多的关系，多个Observer，一个subject


function Subject(name) {
  this.handlers = [];
}
Subject.prototype.subscribe = function(target) {
  this.handlers.push(target);
}
Subject.prototype.publist = function(...args) {
  this.handlers.forEach(target => {
    target.update(...args);
  });
}
function Observer(fn) {
  this.update = fn
}

const subjectInstance= new Subject(); 

const app2= new Observer((...args)=>{console.log('我是小红'+ args[0])}); 

const app3= new Observer((...args)=>{console.log('我是小蓝'+ args[0])}); 

subjectInstance.subscribe(app2);
subjectInstance.subscribe(app3);
subjectInstance.publist('天气转多云');