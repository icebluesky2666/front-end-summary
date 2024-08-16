type myPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
type TodoPreview = myPick<Todo, 'title' | 'completed'>;