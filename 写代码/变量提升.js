console.log(myVar); // 输出: [Function: myVar]

var myVar = "Hello, world!";
console.log(myVar); // 输出: "Hello, world!"

function myVar() {
  return "I am a function";
}
// 函数的提升在变量提升后面，所以会进行覆盖