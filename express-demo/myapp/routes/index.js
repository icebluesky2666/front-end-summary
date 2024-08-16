var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 解析json数据 express.json()
router.get('/', function(req, res, next){
  console.log(req.body)
  res.end('json11');
})
// 解析form-data new multer()
router.post('/', function(req, res, next){
  console.log(req.body)
  res.end('form-data');
})

// 解析 x-www-form-urlencoded express.urlencoded({})
// 获取图片文件  new multer()
// 获取params参数 req.params
// 获取query参数 req.query
// 请求远程api axios
// 异步多api await Promise.All([])
// 请求/写入 数据库 
// 分页数据 
// 自执行的定时任务 cron.schedule('* * * ')

module.exports = router;
