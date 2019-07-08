const path = require('path');
const env = process.env.NODE_ENV
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  // mode: 'production', // development
  entry: ['./src/index.js'],
  devtool: false,
  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 8919 }),
    new MiniCssExtractPlugin()
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin(),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  module: {
    rules: [
      {test: /\.[le]|[c]ss$/,use: ['style-loader',
        // 拆除css 
        // MiniCssExtractPlugin.loader,
        'css-loader', "postcss-loader", 'less-loader']},
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
  devServer:{
    //服务器的IP地址，可以使用IP也可以使用localhost
    host:'localhost',
    //服务端压缩是否开启
    compress:true,
    //配置服务端口号
    port:8090,
    // 实时刷新  
    // inline: true,
    hot: true
  }
};