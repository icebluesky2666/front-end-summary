import { useEffect, useState, useRef } from "react";

// 如果只是想在渲染期间使用
function useLastStates(init){
  const [data, setDataBack] = useState(init);
  const lastRef = useRef(init);

  console.log(init, data)

  const setData = (x)=>{
    setDataBack((data)=>{
      lastRef.current = data;
      return x
    })
  }


  return [data,
    setData,
    lastRef.current]
}
export default useLastStates;