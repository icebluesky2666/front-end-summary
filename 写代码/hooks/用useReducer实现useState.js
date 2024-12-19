function useState(inirData){
  const [state, dispach] = useReducer((state, action)=>{
    if(action.type === 'init'){
      return typeof action.data === 'object'?Object.assign(state, action.data): action.data
    }
  }, inirData);
  
  const setState = (data)=>{
    dispach({
      type: 'init',
      data,
    });
  }
  return [state, setState]
}