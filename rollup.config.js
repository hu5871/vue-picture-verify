import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import vue from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from 'rollup-plugin-replace'
import image from "@rollup/plugin-image"

export default {
  input:'./src/lib/install.js',//入口文件
  output:{
    format: 'umd',//输出格式  模块化类型
    globals:"VuePictureVerify",//全局变量名字
    name:'[name].js',
    file:"dist/VuePictureVerify.js",//输出的文件
    sourcemap:true,//转换前后的映射
  },
  plugins:[
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.VUE_ENV': JSON.stringify('browser')
    }),
    nodeResolve(),
    image(),
    commonjs(),
    vue({
      css: true,
      compileTemplate: true
    }),
    babel({
      exclude:"node_modules/**"
    }),
    serve({
      // open:true,//是否自动打开浏览器
      port:3001,
      contentBase:'',
      openPage:"/index.html"
    })
  ]
}