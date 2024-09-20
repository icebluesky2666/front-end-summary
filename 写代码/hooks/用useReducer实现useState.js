function useState(){
  const [state, dispach] = useReducer((data, tmpState)=>{
    return typeof data === 'object'?Object.assign(tmpState, data): data
  }, inirData);
  
  const setState = (data)=>{
    dispach(data, state);
  }
  return [state, setState]
}