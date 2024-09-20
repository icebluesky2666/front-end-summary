import { useEffect, useState, useRef } from "react";

// 如果只是想在渲染期间使用
function useLastStates(init){
  const oldRef = useRef(null)
  const currentRef = useRef(null)

  if(!Object.is(currentRef.current, init)){
    oldRef.current = currentRef.current;
    currentRef.current = init;
  }
  
  console.log(oldRef.current , '    ', currentRef.current)

  return oldRef.current
}
export default useLastStates;

// import { useRef } from 'react';

// const defaultShouldUpdate = (a, b) => !Object.is(a, b);

// function useLastStates(
//   state,
//   shouldUpdate = defaultShouldUpdate,
// ) {
//   const prevRef = useRef();
//   const curRef = useRef();
//   if (shouldUpdate(curRef.current, state)) {
//     prevRef.current = curRef.current;
//     curRef.current = state;
//   }else{
//     console.log( '阻止的：',prevRef.current ,'---', curRef.current,'---', state)
//   }
//   console.log( '正常的：',prevRef.current ,'---', curRef.current,'---', state)
//   // prevRef.current = curRef.current;
//   // curRef.current = state;
//   return prevRef.current;
// }

// export default useLastStates;