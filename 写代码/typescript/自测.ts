// Pick
type MyPickTest<T, K extends keyof T> = {
  [P in K]: T[P]
}
// Omit
type MyOmitTest<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// Partial
type MyPartialTest<T> = {
  [P in keyof T]?: T[P]
}
// Record
type MyRecordTest<K extends keyof any, T> = {
  [P in K]: T 
} 
// Exclude
type MyExcludeTest<K, T> = K extends T? never: K
// Extract
type MyExtractTest<K, T> = K extends T? K: never
// Readonly
type MyReadonlyTest<T> = {
  readonly [P in keyof T]: T[P]
}
// Required
type MyRequiredTest <T> = {
  [P in keyof T]-?: T[P]
}
// ReturnType
type MyReturnTypeTest <T extends (props: any)=> any> = T extends (props: any) => infer R?R: never
// Parameter
type ParameterTypeTest <T extends (props: any) => any> = T extends (props: infer R) => any?R: never