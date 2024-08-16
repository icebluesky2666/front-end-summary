// 核心思想是创建一个实现组件接口的类，包含一个指向组件对象的引用，并在调用组件方法时添加额外的行为。
// 利用高阶函数的思想，扩充类或者函数的功能

// 普通类中的使用，借助extends进行层层封装
class MyComponent {
  constructor(name) {
    this.name = name
  }
  getname() { return this.name }
}
class DecoratorComponent {
  constructor(comp) {
    this.comp = comp
  }
  getname() { this.comp.getname()}
}

class LoggingUserDecorator extends DecoratorComponent {
  getname() {
    console.log(`Logging: --------`)
    return this.comp.getname();
  }
}

let MyComponentInstance = new MyComponent('John Doe');
let LoggingUserDecoratorInstance = new LoggingUserDecorator(MyComponentInstance);
console.log(LoggingUserDecoratorInstance.getname()); // Logging: John Doe)

// 函数中使用
function BComponent(name) {
  this.name = name
}
BComponent.prototype.getname = function() { return this.name }


function BComponentDecorator(B) {
  return function(arguments) {
    console.log(`Logging: --------`)
    return B.getname(arguments);
  }
}
const BComponenFntDecorator = BComponentDecorator(new BComponent('xiaoke') );
console.log(BComponenFntDecorator())

// 函数使用2

function sayHello(message) {
    console.log(message)
}

function sayHelloDecorator(func) {
  return function(...args) {
    console.log(`Logging: --------`)
    return func(...args);
  }
}
sayHelloDecorator(sayHello('world'))

// Es7装饰器
// 类装饰器
function withLogging(target) {
  return class extends target {
    constructor(...args) {
      super(...args);
      console.log(`Creating instance of ${target.name} with arguments: ${args}`);
    }
  };
}

// 方法装饰器
function logMethod(target, key, descriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args) {
    console.log(`Calling ${key} with arguments: ${args}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

// 使用示例
@withLogging
class User {
  constructor(name) {
    this.name = name;
  }

  @logMethod
  getName() {
    return this.name;
  }
}

const user = new User('John Doe');
console.log(user.getName()); // 输出: Creating instance of User with arguments: John Doe
                             //      Calling getName with arguments: 
                             //      John Doe