interface Todo {
  title: string;
  description: string;
  completed: boolean;
  aa?:string
}

// 案例\
type RequiredTodo = Required<Todo>
const RequiredObj: RequiredTodo  = {
  title: 'string',
  description: 'string',
  completed: true,
  aa: ''
} 
// 实现
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
}
// 验证
type MyRequiredType = MyRequired<Todo>
const requireObj2: MyRequiredType  = {
  title: 'string',
  description: 'string',
  completed: true,
  aa: ''
} 

interface K {
  a: string
}