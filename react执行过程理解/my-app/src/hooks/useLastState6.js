import { useEffect, useState, useRef } from "react";

// 如果只是想在渲染期间使用
function useLastStates(init){
  const [data, setData] = useState(init);


  const lastRef = useRef(data)
  useEffect(()=>{
    lastRef.current = data;
  },[data])
  // lastRef.current = data;
  
  console.log(init, data)
  const getLeast = ()=>{
    return lastRef.current;
  }
  return [data,
    setData,
    getLeast]
}
export default useLastStates;