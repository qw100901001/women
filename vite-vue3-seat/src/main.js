import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import './utils/rem.js';
import router from './router/index.js';

const app = createApp(App);
app.use(router);
app.mount('#app');

