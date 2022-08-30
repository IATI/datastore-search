import { createI18n } from 'vue-i18n';
import en from '../locale/en/index';
import fr from '../locale/fr/index';

const messages = {
    en,
    fr,
};

const i18n = createI18n({
    locale: navigator.language || navigator.userLanguage,
    fallbackLocale: 'en',
    messages,
});

export default i18n;
