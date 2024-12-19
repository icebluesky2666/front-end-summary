// 实现redux createstore dispatch subscribe
interface Action1 {
  type: string,
  payload: any
}

function Redux(store, reducter){
  this.store = store;
  this.reducer = reducter;
  this.handller = [];
}
Redux.prototype.createStore = function(store, reducter){
  return new Redux(store, reducter);
}
Redux.prototype.dispatch = function(action: Action1){
  this.store = this.reducer(this.store, this.action);
  (this.handleller || []).forEach((callback)=>{
    callback(this.store)
  })
}
Redux.prototype.subscribe = function(fn){
  this.handleller.push(fn);
}
