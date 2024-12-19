import react, { useRef, useMemo, useState, useContext, createContext, useEffect } from 'react'
import {contextA} from './contextext'

function ContextChild2() {

  const {data2} = useContext(contextA);
  console.log('child2元素执行重新渲染')
  return <><button onClick={()=>{
    // setData((data)=>{
    //   return data+'ha'
    // })
  }}>我是child2={data2}</button></>
}

export default react.memo(ContextChild2);
