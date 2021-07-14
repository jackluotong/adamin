const path = require('path')
const webpack = require('webpack')
switch (process.env.VUE_APP_TITLE) {
  case 'dev':
    prefixStr = '/dev/giq/tsam/'
    break
  case 'pro':
    prefixStr = '/dev/giq/tsam/'
}
const resolve = dir => {
  return path.join(__dirname, dir)
}
const BASE_URL = process.env.NODE_ENV === 'production' ? '/dev/giq/tsam' : ''

module.exports = {
  baseUrl: BASE_URL,
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
