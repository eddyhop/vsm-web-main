// Introduce a contour adaptation plug-in
// const px2rem = require('postcss-px2rem')

// Configure base size
// const postcss = px2rem({
// The baseSize baseSize needs to be the same as in rem.js
//     remUnit: 100
// })

module.exports = {
  runtimeCompiler: true,
  publicPath: './', // Sets the relative path to the packaging file
  productionSourceMap: false, // Do you build a source Map for the production environment?
  devServer: {
    // open: process.platform === 'darwin',
    // host: 'localhost',
    port: 8071,
    // open: true, the configuration automatically starts the browser
    proxy: {
      '/vsm': {
        target: 'http://127.0.0.1:18888',
        // target: 'http://192.168.103.179:8888',
        // Target: 'HTTP: 192.168.103.179:8888', 
        // target: 'http://192.168.1.123:8888',
        // Target: 'HTTP: 192.168.1.123:8888',
        // target: 'http://192.168.1.181:18888',
        // target: 'http://192.168.100.159:8888',
        // Target: 'HTTP: 192.168.100.159:8888',
        // target: 'http://192.168.1.128:8888',
        // target: 'http://172.16.0.74:18888',
        // target: 'http://39.103.136.149:8888',
        // target: 'http://192.168.1.165:8888',
        // target: 'http://192.168.1.117:8888',
        // target: 'http://192.168.103.194:8888',
        // target: 'http://114.116.17.229:8080',
        // target: 'http://192.168.101.41:8888',
        // target: 'http://172.16.0.33:8888',
        //target: 'http://172.16.0.204:18888',
        // target: 'http://172.16.0.74:18888',
        // target: 'http://192.168.100.126:20102',
        // target: 'http://39.100.38.166:18888',
        // Target: 'HTTP: 39.100.38.166:18888',
        // target: 'http://192.168.103.191:8888',
        // Target: 'HTTP: 192.168.103.191:8888',
        // target: 'http://192.168.103.170:8888',
        // Target: 'HTTP: 192.168.103.170:8888,
        // target: 'http://192.168.103.170:18888',
        // Target: 'HTTP: 192.168.103.170:18888,
        // target: 'http://192.168.103.170:2509',
        // Target: 'HTTP: 192.168.103.170:2509,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/vsm': '/'
        }
      }
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  }
  // lintOnSave: true,
  //   css: {
  //       loaderOptions: {
  //           postcss: {
  //               plugins: [
  //                   postcss
  //               ]
  //           }
  //       }
  //   }
}
