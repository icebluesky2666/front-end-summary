// createApp reducter action subscribe

interface Action {
  type: string,
  props: any
}
interface Store {
  value: any
}



function Redux(store:Store, reducter: any){
  this.reducer = reducter;
  this.store = store;
  this.handller = [];
}
Redux.createApp = (store, reducter: any) =>{
  const ReduxObj = new Redux(store, reducter );
  ReduxObj.reducter = reducter;
  ReduxObj.store = store;
  return ReduxObj;
} 
Redux.prototype.dispatch = function (action: Action){
  this.store = this.reducer(this.store, action);
  (this.handller).forEach((callback: any)=>{
    callback(this.store);
  })
}
Redux.prototype.subscribe = function (handle: any){
  this.handller.push(handle);
}


const reducter = function (store, action: Action){
  let res = {};
  switch (action.type){
    case 'add':
      res = {...store, value: store.value + 1};
      break;
    default:
      res = {...store}
      break;
  }
  return res;
}
const store = Redux.createApp({value: 0}, reducter)
store.subscribe((store)=>{
  console.log('store.value=',store.value)
})
store.dispatch({
  type: 'add'
});
