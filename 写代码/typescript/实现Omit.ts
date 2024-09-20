interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 案例\
type props1 = 'title' | 'description';
type Omit1 = Omit<Todo, props1>
const omitObj: Omit1  = {
  completed: true
} 
// 实现
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// 验证
type newTodo3 = MyOmit<Todo, props1>
const omitObj2: newTodo3  = {
  completed: true
} 