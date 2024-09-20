type FuncReturnType = ReturnType<() => number>; // => number

type MyReturnType<T extends (...props: any) => any> = T extends (...props: any)=> infer R? R: never