import react, { useRef, useState, useContext, createContext, useMemo } from 'react'
import ContextChild from './contextchild'
import Contextchild2 from './contextchild2'
export const contextA = createContext();
export const contextB = createContext();
function Test1() {
  const [data, setData] = useState(1);
  const [data2, setData2] = useState(2);
  console.log('父元素执行重新渲染')

  const data2Back = useMemo(()=>{return data2}, [data2])
  return (
    <contextA.Provider value={
      {
        data,
        setData,
        data2,
        setData2
      }
    }>
      <contextB.Provider value={data2Back}>
        <div >
          {data}/{data2}
          <ContextChild></ContextChild>
          <Contextchild2></Contextchild2>
        </div>
    </contextB.Provider>
      
    </contextA.Provider>
   
  );
}

export default Test1;
