interface User {
  name?: string
  age: number
}
type UserChild<T> =  {
  [P in keyof T]: T[P]
}
type UserChild1<T, K extends keyof T> =  {
  [P in K]: T[P]
}


// Partial 使所有类型都变成可选的
const a:Partial<User> = {name: 'John'}
// Requird 使所有类型都变成必填的
const b:Required<User> = {
  name: 'John',
  age: 0
}
// Readonly 使所有属性变为只读的
const c: Readonly<User> = {
  name: 'John',
  age: 0
}// c.age = 1; // Error: Cannot assign to 'age' because it is a read-only property.
// Record<Keys, Type> keys为对象的key类型， Type为value类型
type code = string
const d: Record<string, User> = {
  a: {
    name: 'Alice',
    age: 10
  },
}
// Pick<Type, Keys> 从类型Type中选择一组属性Keys来创建类型。
type newUser = Pick<User, 'name' | 'age'>
// Omit<Type, Keys> 从类型Type中排除一组属性Keys来创建类型。
type UserOmitAddress = Omit<User, 'age'> 
// Exclude<UnionType, ExcludedMembers> 从联合类型UnionType中排除ExcludedMembers类型然后返回一个新类型。
type UserExcludeAddress = Exclude<keyof User, 'address'> // "name" | "age"
// Extract<Type, Union> 从类型Type中提取那些来自联合类型Union的类型。
type UserExtractAddress = Extract<keyof User, 'name' | 'ssss'> // "address"
const e:UserExtractAddress = 'name'

// NonNullable <Type> 去除null和undefined类型，返回一个非null和非undefined的类型
type PortNumber = string | number | null;
type ServerPortNum = NonNullable<PortNumber>

// Parameters<Type> 返回一个函数类型Type的参数列表
type GetServerConfig = Parameters<(serverConfig: { port: number }) => void> // [number]
// ReturnType<Type> 返回一个函数类型Type的返回值类型
type ServerConfigReturnType = ReturnType<(serverConfig: { port: number }) => void> // void

// Awaited<Type> 将Promise<Type> 转换为 Type
type ResolveType<T> = T extends PromiseLike<infer U>? U : T
type ServerConfigResolveType = Awaited<ReturnType<(serverConfig: { port: number }) => Promise<{ port: number }>>>

// ReadonlyArray<Type> 创建一个只读数组类型
const f: ReadonlyArray<number> = [1, 2, 3]




