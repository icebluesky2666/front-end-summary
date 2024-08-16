// 屏蔽实例创建细节
function factory(type, name){
  function Animal(name){
    this.name = name;
  }
  function People(name){
    this.name = name;
    this.language = ['chinese']
  }
  switch(type){
    case 'animal':
      return new Animal(name);
      break
    case 'people':
      return new People(name);
      break
    default:
      throw new Error('Invalid type');
  }
}
let animal = factory('animal');
let peopleone = factory('xiaoming');