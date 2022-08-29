import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueGtag from 'vue-gtag';
import './index.css';
import plausible from '../plugins/plausible';
import { createI18n } from 'vue-i18n';
import en from '../locale/en/index';
import fr from '../locale/fr/index';

const plausibleOptions = {
    domain: import.meta.env.PLAUSIBLE_DOMAIN,
    hashMode: true,
    trackLocalhost: false,
};

const messages = {
    en,
    fr,
};

const i18n = createI18n({
    locale: navigator.language || navigator.userLanguage,
    fallbackLocale: 'en',
    messages,
});

createApp(App)
    .use(i18n)
    .use(VueGtag, {
        config: {
            id: import.meta.env.VUE_ENV_GA_ID,
            params: {
                anonymize_ip: true,
            },
        },
    })
    .use(router)
    .use(plausible, plausibleOptions)
    .mount('#app');
