// 案例
type UserExclude = Exclude<"name" | "age" | "userId", "name">;

// 等同于
// type UserExclude = "age" | "userId"

// 实现
type MyExclude<K , T> = K extends T? never: K
// 验证
type UserExclude1 = MyExclude<"name" | "age" | "userId", "name">;