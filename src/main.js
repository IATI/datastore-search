import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import plausible from '../plugins/plausible';
import i18n from './i18n.js';

const plausibleOptions = {
    domain: import.meta.env.PLAUSIBLE_DOMAIN,
    hashMode: true,
    trackLocalhost: false,
};

createApp(App).use(i18n).use(router).use(plausible, plausibleOptions).mount('#app');
