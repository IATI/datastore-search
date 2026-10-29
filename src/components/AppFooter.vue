<script setup>
import LanguageSelector from './LanguageSelector.vue';
</script>

<template>
    <footer class="iati-footer iati-brand-background">
        <div class="iati-brand-background__content">
            <div class="iati-footer__section iati-footer__section--last">
                <div class="iati-footer__container">
                    <nav>
                        <ul class="iati-piped-list iati-footer__legal-nav">
                            <li>
                                <a
                                    :href="
                                        'https://web-terms.iatistandard.org/' +
                                        $i18n.locale +
                                        '/latest/privacy-policy/'
                                    "
                                    >{{ $t('message.footer_privacy') }}</a
                                >
                            </li>
                            <li>
                                <a
                                    :href="
                                        'https://web-terms.iatistandard.org/' +
                                        $i18n.locale +
                                        '/latest/cookie-policy/'
                                    "
                                    >{{ $t('message.footer_cookies') }}</a
                                >
                            </li>
                            <li>
                                <a
                                    :href="
                                        'https://web-terms.iatistandard.org/' +
                                        $i18n.locale +
                                        '/latest/copyright/'
                                    "
                                    >{{ $t('message.footer_copyright') }}</a
                                >
                            </li>
                            <li>
                                <a
                                    :href="
                                        'https://web-terms.iatistandard.org/' +
                                        $i18n.locale +
                                        '/latest/data-removal/'
                                    "
                                    >{{ $t('message.footer_data_removal') }}</a
                                >
                            </li>
                        </ul>
                    </nav>
                    <div class="iati-footer__actions">
                        <LanguageSelector />
                    </div>
                    <div class="iati-footer__social">
                        <a
                            href="https://www.linkedin.com/company/international-aid-transparency-initiative/"
                            aria-label="LinkedIn"
                        >
                            <i class="iati-icon iati-icon--linkedin"></i>
                        </a>
                        <a href="https://x.com/IATI_aid" aria-label="X">
                            <i class="iati-icon iati-icon--x"></i>
                        </a>
                        <a
                            href="https://www.youtube.com/channel/UCAVH1gcgJXElsj8ENC-bDQQ"
                            aria-label="YouTube"
                        >
                            <i class="iati-icon iati-icon--youtube"></i>
                        </a>
                        <a
                            href="https://www.facebook.com/IATIaid/"
                            aria-label="Facebook"
                        >
                            <i class="iati-icon iati-icon--facebook"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
