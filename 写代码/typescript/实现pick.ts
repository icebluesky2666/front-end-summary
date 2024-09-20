type myPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
type TodoPreview = myPick<Todo, 'title' | 'completed'>;


//自测 实现Pick 从一个类型里面挑出一部分字段
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P] 
}