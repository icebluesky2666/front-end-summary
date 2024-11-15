interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

// 案例\
type props = string;
type values = {
  name: string
}
type Record1 = Record<props, values>
const reordObj: Record1  = {
  name: {
    name: '1'
  }
}
// 实现
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}
// 验证
type newTodo2 = MyRecord<props, values>
const recordObj1: newTodo2  = {
  name: {
    name: '1'
  }
} 