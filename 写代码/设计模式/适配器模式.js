// 将一个类的接口转变为另一个接口，一种数据结构适配成另一种数据结构

let googleMap = {
  show: function() {
    console.log('Google Map is shown');
  }
}
let baiduMap = {
  display: function() {
    console.log('baidu Map is shown');
  }
}

function renderMap(instance){
  if(instance.show instanceof Function){
    instance.show();
  }
}

var addapterBaiduMap = {
  show: function() {
    baiduMap.display()
  }
}
renderMap(googleMap);
renderMap(addapterBaiduMap);
