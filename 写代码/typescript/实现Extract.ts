// 案例
type UserExtract = Extract<"name" | "age" | "userId", "name">;

// 等同于
// type UserExtract = "name" 

// 实现
type MyExtract<K , T> = K extends T? K: never
// 验证
type UserExtract1 = MyExtract<"name" | "age" | "userId", "name">;