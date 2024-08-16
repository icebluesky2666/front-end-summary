// 普通加载路由
// import jj from './jj.vue'
// 懒加载路由
const jj = () => import('./jj.vue')
export default {
  path: '/jj',
  name: 'jj',
  component: jj,
  children: [
  ]
}