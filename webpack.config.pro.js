const { resolve } = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ChunkManifestPlugin = require("chunk-manifest-webpack-plugin");
const WebpackChunkHash = require("webpack-chunk-hash");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


module.exports = {
    entry: {
      main: './src/index.pro.js', // 我们 app 的入口文件
      vendor: [
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'react-router-dom',
        'axios',
        'react-custom-scrollbars',
      ],
    },
    output: {
      filename: 'js/[name].[chunkhash:6].min.js',
      // 输出的打包文件

      path: resolve(__dirname, 'dist'),
      
      chunkFilename: "[name].[chunkhash].js",

      publicPath: '/'
      // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            'babel-loader',
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              'css-loader?modules',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              },
            ],
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              'css-loader',
              {
                loader: 'less-loader',
              },
            ],
          }),
        },
        {
          test: /\.(png|jpg|gif|jpeg)$/,
          use: ['url-loader?limit=8192'],
          exclude: /node_modules/
        },
        { 
          test: /\.svg(\?.*)?$/,   
          use: ['url-loader?prefix=fonts/&name=[hash:base64:20].[ext]&limit=10000&mimetype=image/svg+xml'],
          exclude: /node_modules/
        },
        { 
          test: /\.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, 
          use: 'url-loader?limit=100000',
          exclude: /node_modules/
        }
      ],
    },

    plugins: [

      new webpack.optimize.UglifyJsPlugin({
          // comments: true,
          // mangle: false,
          // compress: {
          //     warnings: true
          // }
      }),
      new ExtractTextPlugin('css/[name]-[chunkhash:6].min.css'),
      
      new webpack.optimize.CommonsChunkPlugin({
        name: ["vendor", "manifest"], // vendor libs + extracted manifest
        minChunks: function (module) {
            // 该配置假定你引入的 vendor 存在于 node_modules 目录中
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
      }),
      new webpack.HashedModuleIdsPlugin(),
      new WebpackChunkHash(),
      new ChunkManifestPlugin({
        filename: "chunk-manifest.json",
        manifestVariable: "webpackManifest"
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: {removeAll: true } },
        canPrint: true
      }),

      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),

      new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
      })
    ],
};