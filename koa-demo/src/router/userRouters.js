const Router = require('koa-router');
const boderParser = require('koa-bodyparser');
const router = new Router({prefix: "/users"});


router.use(boderParser());
router.post('/', (ctx, next) => {
  console.log(ctx.request.body);
  console.log('ctx.body:', ctx.body)
  ctx.response.body = "User Lists~";
});

router.put('/', (ctx, next) => {
  ctx.response.body = "put request~";
});


module.exports = router;
