const Koa = require('koa');
const app = new Koa();
const userRouter = require('./router/userRouters')


app.use((ctx, next) => {
  ctx.response.body = 'hahaha';
  next();
})
app.use(userRouter.routes());

app.listen(3030)