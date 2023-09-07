import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from '@/router';
import '@/utils/axios/axios';

/**
 * -------------------------------------------------------------------------------------
 * css...
 * -------------------------------------------------------------------------------------
 */
import 'vue-toastification/dist/index.css';

/**
 * -------------------------------------------------------------------------------------
 * Components from 3rd party packages...
 * -------------------------------------------------------------------------------------
 */
import VueFeather from 'vue-feather';
import Toast, { PluginOptions } from 'vue-toastification';

const toastOptions: PluginOptions = {
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    timeout: 8000,
    toastClassName: 'menu-app-toast',
};

const app = createApp(App);

app.use(router)
    .use(Toast, toastOptions)
    .component('Icon', VueFeather)
    .mount('#app');

app.config.warnHandler = () => null;
