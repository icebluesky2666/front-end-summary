import { useEffect, useState, useRef } from "react";

// 如果只是想在渲染期间使用
function useLastStates(init){
  const [data, setData] = useState(init);
  const lastRef = useRef(init);

  console.log(init, data)

  useEffect(()=>{
    console.log('变化',data)
    lastRef.current = data
  },[data])

  const getLast = ()=> {return lastRef.current;}

  return [data,
    setData,
    getLast]
}
export default useLastStates;