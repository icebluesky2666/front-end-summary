// action
interface Action {
  type: string,
  payload?: any
}
const addAction: Action = {
  type: 'ADD'
}

// reducer
interface Store{
  num: number
}
const reducterFunc = (data: Store = {num:0}, action: Action): Store => {
  switch (action.type) {
    case 'ADD':
      return  {num: data.num + 1};
      break
    default:
      return {num: data.num};
  }
}

// store
function classStore(store: Store, reducer: any = reducterFunc){
  this.store = store;
  this.reducer = reducterFunc;
  this.handller = [];
}
classStore.prototype.dispatch = (action: Action) => {
  this.reducer(this.store, action);
  (this.handller || []).forEach(callback => {
    callback?.(this.store)
  });
}
classStore.prototype.getStore = () => {
  return this.store;
}
classStore.prototype.subscribe = (callback: () => void) => {
  this.handller.push(callback);
}
