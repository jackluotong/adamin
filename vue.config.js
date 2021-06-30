const path = require('path')
const webpack = require('webpack')
switch (process.env.VUE_APP_TITLE) {
  case 'dev': // 注意这里的名字要和步骤二中设置的环境名字对应起来
    prefixStr = '/dev/giq/tsam/'
    break
}
const resolve = dir => {
  return path.join(__dirname, dir)
}
// const VueLoaderPlugin = require('vue-loader/lib/plugin')
// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production' ? '/dev/giq/tsam' : ''

module.exports = {
  baseUrl: BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
  },
  productionSourceMap: true,
  devServer: {
    port: 3030,
    compress: true,
    hot: true,
    open: true,
    proxy: {
      '/dcenter': { // https://wxcs.internal.manulife-sinochem.com/dev/giq/
        target: 'http://192.168.3.137:7799', // http://maxwell.cn.utools.club  http://yang.cn1.utools.club http://192.168.1.214:7799
        changeOrigin: true, // 改变源
        pathRewrite: { // '^/bridge': '/bridge' // 路径重写
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }

}
