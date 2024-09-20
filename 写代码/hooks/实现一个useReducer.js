// const [data, dispach] = useReducer(reducer, init)

function useMyReducer(reducer, initdata){
  const dataRef = useRef(null);
  dataRef.rurrent = initdata;
  this.reducer = reducer;
  return [
    dataRef.rurrent,
    useMyReducer.dispach
  ]
}
useMyReducer.prototype.dispach = (action)=>{
  return this.reducer(this.state, action)
}
