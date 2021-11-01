import babel from 'rollup-plugin-babel' // 安装了连接插件就不用使用元插件了(babel)
import serve from 'rollup-plugin-serve'

export default {
  input: './src/index.js', //webpack中的entry
  output: {
    format: 'umd', //umd打包模块化规范
    name: 'Vue',
    file: 'dist/umd/vue.js', //webpack的path(必须绝对路径)+filename配置,
    sourcemap: true //webpack的mode=development并且devtool=source-map
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' //不编译
    }),
    serve({
      port: '3000', //devServer中的选项
      open: true,
      contentBase: '',
      openPage: '/index.html' //webpack用html-webpack-plugin对index.html进行打包
    })
  ]
}
