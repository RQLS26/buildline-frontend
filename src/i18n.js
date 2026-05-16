/**
 * Internationalization Configuration
 * @description Sets up vue-i18n with English and Spanish locale support.
 * @author RQLS TEAM
 */
import {createI18n} from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en,
        es
    }
});
export default i18n;
