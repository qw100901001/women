// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
// 导入你需要跳转的页面组件（示例：详情页）
import MainPage from '../components/Main.vue';
import ImgPage from '../components/ImgPage.vue'; // 当前的搜索页面

// 定义路由规则
const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/imgPage', // 详情页路由
    name: 'ImgPage',
    component: ImgPage
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Vue 3 Vite 环境
  // history: createWebHistory(), // Vue CLI 环境
  routes
});

export default router;