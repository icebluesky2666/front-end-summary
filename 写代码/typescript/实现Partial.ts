interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 案例
type newTodo = Partial<Todo>
const partialObj: newTodo  = {
  title: '1'
} 
// 实现
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
// 验证
type newTodo1 = MyPartial<Todo>
const partialObj1: newTodo1  = {
  title: '1'
} 