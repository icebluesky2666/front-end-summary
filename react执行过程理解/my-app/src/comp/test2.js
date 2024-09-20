import react, { useEffect, useRef, useState } from 'react'

function Test2() {
  const [data, setData] = useState(1);
  const dataRef = useRef(null);
  useEffect(()=>{
    // useEffect在渲染之后执行，dataRef.current保存的值不会随着渲染执行，而发生变化
    dataRef.current = data
  },[data])
  return (
    <div >
      {data}/{dataRef.current}
      <button onClick={()=>{setData((d)=> {
        return d+1
      })}}>加一</button>
    </div>
  );
}

export default Test2;
