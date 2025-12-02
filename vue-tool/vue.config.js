const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
      }
    }
  },
  configureWebpack: {
    externals: {
      child_process: 'commonjs child_process',
      fs: 'commonjs fs',
      path: 'commonjs path'
    }
  }
})
