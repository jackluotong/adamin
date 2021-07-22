const path = require('path')
const webpack = require('webpack')
let prefixStr = ''
switch (process.env.VUE_APP_TITLE) {
  case 'dev':
    prefixStr = '/dev/giq/tsam/'
    break
  case 'prod':
    prefixStr = '/tsam/'
    break
  case 'sit':
    prefixStr = '/tsam/'
    break
  case 'uat':
    prefixStr = '/tsam/'
    break
  default: console.log(process.env.VUE_APP_TITLE)
}
const resolve = dir => {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: prefixStr,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },

  productionSourceMap: true,
  devServer: {
    port: 3030,
    compress: true,
    hot: true,
    open: true,
    proxy: {
      '/dadmin': {
        target: 'https://wxcs.internal.manulife-sinochem.com/dev/giq/',
        changeOrigin: true,
        pathRewrite: {
          '^/dadmin': ''
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: this.mode === 'production' ? 'js/[name].[contenthash:10].js' : 'js/[name].[hash:10].js'
    }
  }
}
