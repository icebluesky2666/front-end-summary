import react, { useRef, useState, useContext, createContext } from 'react'
import {contextA} from './contextext'

function ContextChild() {

  const {data, setData} = useContext(contextA);
  console.log('child1元素执行重新渲染')
  return (
      <><button onClick={()=>{
        setData((data)=>{
          return data+'ha'
        })
      }}>我是test1={data}</button></>
  );
}

export default ContextChild;
