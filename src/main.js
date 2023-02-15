import { createApp } from 'vue';
import MultiSelect from 'vue-multiselect';
import plausible from '../plugins/plausible';
import App from './App.vue';
import i18n from './i18n.js';
import './index.css';
import router from './router';

const plausibleOptions = {
    domain: import.meta.env.PLAUSIBLE_DOMAIN,
    hashMode: true,
    trackLocalhost: false,
};

createApp(App)
    .use(i18n)
    .use(router)
    .use(plausible, plausibleOptions)
    .component('v-select', MultiSelect)
    .mount('#app');
