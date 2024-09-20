function A() {
  return Promise.reject(new Error(Math.random()));
}

// 这样会先执行catch，然后执行后面的then
A().then(() => console.log('第一个then'))
  .catch(e => {
    console.log('第一个catch')
    return Promise.reject(2)
  })
  .then((x) => console.log('第二个then',x))
  .catch((x) => console.log('第二个catch',x))