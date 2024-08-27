
const data = {
  text: 'default'
};
const input = document.getElementById('input');
// defineProperty
Object.defineProperty(data, 'text', {
  set(value){
    input.value = value;
  }
})
// proxy
let proxy = new Proxy(data, {
  set(target, key, value){
    target[key] = value;
    input.value = value;
    return value;
  }
})
// 绑定
input.addEventListener('keyup', function(e){
  data.text = e.target.value;
})