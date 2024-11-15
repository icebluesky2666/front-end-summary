import react, { useEffect, useRef, useState } from 'react'
import useLastStates from '../hooks/useLastState6'

function Test3() {
  const [data, setData, getLeast] = useLastStates(1);

  return (
    <div >
      {data}/{getLeast()}
      <button onClick={()=>{setData(data+1)}}>加一</button>
      {/* 这里的展示展示按钮其实还是最新的数据 */}
      <button onClick={()=>{console.log(getLeast())}}>展示</button>
    </div>
  );
}

export default Test3;
