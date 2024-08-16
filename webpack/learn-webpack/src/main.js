// 通过 CommonJS 规范导入 CSS 模块
// require('@src/main.css');
// require('style-loader!css-loader!./main.css');
// 通过 CommonJS 规范导入 show 函数
// const show = require('./show.js');

import show from './show.js';
import './main.css';
// 执行 show 函数
show('Webpack');