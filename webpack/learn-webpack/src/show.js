// 操作 DOM 元素，把 content 显示到网页上


// 通过 CommonJS 规范导出 show 函数
// module.exports = show;
const show = (content) => {
  console.log('debug')
  window.document.getElementById('app').innerText = 'Hello, hahahah11' + content;
}
export default show