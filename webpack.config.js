const path = require('path');

module.exports = {
  entry: ["@babel/polyfill",'./src/index.js'],
  module: {
    rules: [
      {
        test: /\.less$/,use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.js$/,
        use: { loader: 'babel-loader'},
        exclude:'/node_modules/'
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'tia-player.js'
  },
  // devServer:{
  //   //设置基本目录结构
  //   contentBase:path.resolve(__dirname,'/'),
  //   //服务器的IP地址，可以使用IP也可以使用localhost
  //   host:'localhost',
  //   //服务端压缩是否开启
  //   compress:true,
  //   //配置服务端口号
  //   port:8090
  // }
};