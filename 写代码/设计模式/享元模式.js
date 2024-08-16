// 优化程序性能，将对象的状态优化为外部状态

// 某商家有 50 种男款内衣和 50 种款女款内衣, 要展示它们
const Model = function(gender, underwear) {
  this.gender = gender
  this.underwear = underwear
}

Model.prototype.takephoto = function() {
  console.log(`${this.gender}穿着${this.underwear}`)
}

for (let i = 1; i < 51; i++) {
  const maleModel = new Model('male', `第${i}款衣服`)
  maleModel.takephoto()
}

for (let i = 1; i < 51; i++) {
  const female = new Model('female', `第${i}款衣服`)
  female.takephoto()
}
// 优化思路
// 1、创建modle工厂，实现单例模式确保只有两个modle
// 2、将衣服抽离出来，作为外部状态
const Model2 = function(gender, underwear) {
  this.gender = gender
}
Model2.prototype.takephoto = function() {
  console.log(`${this.gender}穿着${this.underwear}`)
}
const ModelFactory = (function() {
  let instance = {
    male: null,
    female: null
  }

  return function(gender) {
    if (!instance[gender]) {
      instance[gender] = new Model2(gender);
    }
    return instance[gender];
  };
})();
const modleManger = function(){
  // 衣架
  const yijia = {};
  return {
    // 在衣架上挂衣服
    add: function(gender, i){
      yijia[i] = {
        underwear: `第${i}款衣服`
      }
      return ModelFactory(gender, i)
    },
    // 将衣服穿在身上
    copy: function(model, i){
      model.underwear = yijia[i].underwear
    }
  }
}
for(let i = 1; i < 51; i++) {
  // 挂衣服 & 确定模特
  let modle = modleManger.add('male', i)
  // 穿上衣服
  modleManger.copy(modle, i)
  // 展示衣服
  modle.takephoto()
}
for(let i = 1; i < 51; i++) {
  // 挂衣服 & 确定模特
  let modle = modleManger.add('female', i)
  // 穿上衣服
  modleManger.copy(modle, i)
  // 展示衣服
  modle.takephoto()
}

