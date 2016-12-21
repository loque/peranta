const webpack = require('webpack')
const PROD = JSON.parse(process.env.PROD_ENV || '0')

module.exports = {
     entry: {
         server: './src/server.js',
         client: './src/client.js',
         router: './src/router/index.js',
     },
     output: {
         path: './',
         filename: '[name].js',
         libraryTarget: 'umd',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
         }]
     },
     externals: {
         'array-flatten': 'array-flatten',
         'object.values': 'object.values',
         'path-to-regexp': 'path-to-regexp',
         'qs': 'qs',
         'url-parse': 'url-parse',
         'uuid': 'uuid',
     },
     plugins: PROD ? [
         new webpack.optimize.UglifyJsPlugin({
             compress: {
                 warnings: false,
             },
             output: {
                 comments: false,
             },
             mangle: {
                 keep_fnames: true,
             },
         }),
     ] : [],
 }
