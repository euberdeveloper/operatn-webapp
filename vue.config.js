module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  chainWebpack: webpackConfig => {
    webpackConfig.module
      .rule('md')
      .test(/.md$/)
      .use('raw-loader')
      .loader('raw-loader')
  },
}
