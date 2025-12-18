import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import './utils/rem.js';
import router from './router/index.js';
import photoPreview from 'vue3-photo-preview';
import 'vue3-photo-preview/dist/index.css';

const app = createApp(App);
app.use(router);
app.use(photoPreview);
app.mount('#app');

