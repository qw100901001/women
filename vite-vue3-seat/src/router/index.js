// src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router';
// 导入你需要跳转的页面组件（示例：详情页）
import MainPage from '../components/Main.vue';
import ResultPage from '../components/Result.vue';
import ImgPage from '../components/ImgPage.vue';


// 定义路由规则
const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage
    },
    {
        path: '/resultPage',
        name: 'ResultPage',
        component: ResultPage
    },
    {
        path: '/imgPage', // 详情页路由
        name: 'ImgPage',
        component: ImgPage
    }
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory (),
    routes
});

export default router;