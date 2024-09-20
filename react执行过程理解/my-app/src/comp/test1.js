import react, { useRef, useState } from 'react'

function Test1() {
  const [data, setData] = useState(1);
  const dataRef = useRef(null);
  dataRef.current = data;
  return (
    <div >
      {data}/{dataRef.current}
      <button onClick={()=>{setData((d)=> {
        return d+1
      })}}>加一</button>
    </div>
  );
}

export default Test1;
