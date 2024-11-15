// pick
type PickT<T, P extends keyof T> = {
  [K in P]: T[P]
}
// omit
type OmitT<T, P extends keyof T> = Pick<T, Exclude<keyof T, P>>
// exclude
type ExcludeTT<T, K> = T extends K?never: K;
// ectract
type ExtractTT<T, K> = T extends K?K:never;
// Partial
type PartialTT<T, K extends keyof T> = {
  [L in K]?: T[L]
}
// Readonly
type ReadOnlyTT<T, P extends keyof T> = {
  readonly [L in P]: T[L]
}
// Required
type RequiredTT<T, P extends keyof T> = {
  [L in P]-?: T[L]
}
// ReturnType
type ReturnTypeTT<T extends (props: any) => any> = T extends (props: any) => infer F?F:never;
// Parameter
type ParameterTT <T> = T extends (props: infer P) => any?P: never;