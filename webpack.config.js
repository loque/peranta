const webpack = require('webpack')
const PROD = process.env.NODE_ENV === 'production'

const outputFilename = PROD ? '[name].min.js' : '[name].js'
const outputLibraryTarget = process.env.BABEL_ENV === 'commonjs' ? 'commonjs' : 'umd'

module.exports = {
     entry: {
         server: './src/server.js',
         client: './src/client.js',
         router: './src/router/index.js',
     },
     output: {
         path: './dist/dist',
         filename: outputFilename,
         library: 'Peranta',
         libraryTarget: outputLibraryTarget,
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
