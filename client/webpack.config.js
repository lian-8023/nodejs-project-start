var path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: { 
    "main": ['./views/entry.jsx'],
    "vendor": ['react','react-dom','jquery','antd']
   },
  output: {
    path: path.resolve(__dirname, "./build"),
    publicPath: "./build/",
    filename: "[name].bundle.js"
  },
  resolve: {
    extensions: ['.js','.jsx']
  },  
  module: {
    rules: [
      {test: /\.less$/,exclude: /node_modules/,use:["style-loader","css-loader","less-loader"]},
      {test: /\.css$/,exclude: /node_modules/,use: ["style-loader","css-loader"]},
      {test: /\.(jsx|js)$/,exclude: /node_modules/,loader: 'babel-loader',query: {
        presets: ['es2015','react','stage-1'],
        plugins: ['transform-decorators-legacy','transform-decorators']
        }
      },
      {test: /\.(png|jpg)$/,loader: 'url-loader?limit=8192'},
    ]
  },
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
  //   new webpack.optimize.UglifyJsPlugin({
  //     output: {
  //       comments: false
  //     },
  //     compress: {
  //       warnings: false
  //     }
  //   }),
  //   new webpack.DefinePlugin({
  //     'process.env':{
  //       'NODE_ENV': JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.ModuleConcatenationPlugin(),
  // ]
};