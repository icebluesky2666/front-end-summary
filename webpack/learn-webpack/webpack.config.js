const path = require('path');
const os = require('os');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
module.exports = (env, argv)=>{
  const isProduction = argv.mode === 'production';
  return {
    mode: 'development', // 或 'production'
    // Webpack 在寻找相对路径的文件时会以 context 为根目录（绝对路径），默认是执行目录
    context: path.resolve(__dirname, 'src'),
    // JavaScript 执行入口文件
    entry: './main.js',
    output: {
      // 把所有依赖的模块合并输出到一个 bundle.js 文件
      filename: 'bundle.js',
      // 输出文件都放到 dist 目录下
      path: path.resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          // 用正则去匹配要用该 loader 转换的 CSS 文件
          test: /\.css$/,
          // 使用一组 Loader 去处理,从右向左
          use: [MiniCssExtractPlugin.loader,'css-loader'],
          // 只命中src目录里的js文件，加快 Webpack 搜索速度
          include: path.resolve(__dirname, 'src'),
          // 排除 node_modules 目录下的文件
          exclude: path.resolve(__dirname, 'node_modules'),
        },
        // {
        //   test: /\.js$/,
        //   // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
        //   use: ['happypack/loader?id=babel'],
        //   // 排除 node_modules 目录下的文件，node_modules 目录下的文件都是采用的 ES5 语法，没必要再通过 Babel 去转换
        //   exclude: path.resolve(__dirname, 'node_modules'),
        // },
      ]
    },
    // 接受一个plugin实例的数组
    plugins: [
      // webpack4 之后不支持
      // new ExtractTextPlugin({
      //   // 从 .js 文件中提取出来的 .css 文件的名称
      //   filename: `[name]_[contenthash:8].css`,
      // }),
      // new HappyPack({
      //   // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      //   id: 'babel',
      //   // 如何处理 .js 文件，用法和 Loader 配置中一样
      //   loaders: ['babel-loader'],
      //   // ... 其它配置项
      //   // 使用共享进程池中的子进程去处理任务
      //   threadPool: happyThreadPool,
      // }),
      new MiniCssExtractPlugin({
        filename: '[name]_[contenthash:8].css',
        chunkFilename: '[id].jonqin.css',
      }),
    ],
    // 开发服务器配置
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'), // 静态文件目录
      },
      compress: true, // 启用 gzip 压缩
      port: 3000, // 端口号
      open: true, // 自动打开浏览器
      hot: true, // 启用热模块替换
      historyApiFallback: true, // 单页应用(SPA)路由支持
      // inline: true, // 是否自动注入这个代理客户端到将运行在页面里的 Chunk 里去,如果关闭 inline，DevServer 将无法直接控制要开发的网页。这时它会通过 iframe 的方式去运行要开发的网页，当构建完变化后的代码时通过刷新 iframe 来实现实时预览。
      headers: {
        'X-foo':'bar'
      }
      // host: 'localhost', // 监听的主机名局域网其他电脑可以访问
    },
    // Webpack alias 配置
    resolve:{
      alias:{
        '@src': path.join(__dirname, './src')
      },
      extensions: ['.ts', '.js', '.json'],
      // 告诉 webpack 解析模块时应该搜索的目录，类似加入nodemodules
      // modules:['./src/components','node_modules']
      mainFields: ['module', 'browser', 'main']
    }
  };
}