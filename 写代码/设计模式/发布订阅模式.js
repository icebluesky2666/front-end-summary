// 实现
function App() {
  this.events = {};
}
App.prototype.emit = function(type, ...args) {
  if(this.events[type]){
    this.events[type].forEach(handler => {
      handler(...args);
    });
  }
}
App.prototype.on = function(type, handler) {
  if(this.events[type]){
    this.events[type].push(handler);
  }else{
    this.events[type] = [handler];
  }
}
App.prototype.off = function(type, handler) {
  if(this.events[type]){
    this.events[type] = this.events[type].filter(h => h !== handler);
  }
}

const app = new App();
app.on('event1', (data) => {
  console.log('触发event1')
})
app.on('event1', (data) => {
  console.log('触发event1----哈哈')
})


setTimeout(()=>{
  app.emit('event1');
}, 3000)