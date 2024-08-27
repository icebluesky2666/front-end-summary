const arr = [1,2]
console.log(Object.prototype.toString.call(arr))
console.log(arr.__proto__ === Array.prototype)
console.log(Array.isArray(arr))
console.log(arr instanceof Array)
console.log(Array.prototype.isPrototypeOf(arr))