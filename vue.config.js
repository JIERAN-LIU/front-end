const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', //代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        //ws: true, // proxy websockets
        //pathRewrite方法重写url
        pathRewrite: {
          '^/api': ''
        }
      },
      '/upload': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/upload': '/upload'
        }
      }
    }
  },
  chainWebpack: config => {
    const alias = config.resolve.alias
    alias.set('@api', resolve('src/api'))
    alias.set('@c', resolve('src/components'))
  }
}