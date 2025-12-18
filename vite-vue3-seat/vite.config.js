import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 注册 Vue 插件（Vite 官方的 Vue3 插件，已默认安装）
  plugins: [vue()],
  base: './',
  // 路径别名配置（方便项目中用 @ 代替 src 目录）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 开发服务器配置
  server: {
    port: 3004, // 自定义开发服务器端口
    open: true, // 启动项目后自动打开浏览器,
    host: '0.0.0.0', // 开发服务器
  }
})