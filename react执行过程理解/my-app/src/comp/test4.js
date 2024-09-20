import react, { useEffect, useRef, useState } from 'react'
import useLastStates from '../hooks/useLastState2'

function Test3() {
  const [data, setData] = useState(1);
  const getOld = useLastStates(data);

  return (
    <div >
      {data}/{getOld}
      <button onClick={()=>{setData(data+1)}}>加一</button>
      {/* 这里的展示展示按钮其实还是最新的数据 */}
      <button onClick={()=>{console.log(getOld)}}>展示</button>
    </div>
  );
}

export default Test3;
