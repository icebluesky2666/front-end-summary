import { useState, useRef } from "react";


function UseLeastData(initdata){
  const [data, setDataCurrent] = useState(initdata);
  const leastData = useRef(initdata);

  const getLeastData = () => {
    return leastData.current;
  }
  const setData = (data) => {
    setDataCurrent(()=>{
      leastData.current = data;
      return data;
    });
  }
  return [data,setData,getLeastData];
}
export default UseLeastData;