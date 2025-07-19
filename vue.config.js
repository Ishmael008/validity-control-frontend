const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/validity-control-frontend/',

  transpileDependencies: [
    'quasar'
  ],

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
})
