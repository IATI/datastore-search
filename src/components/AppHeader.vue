<script setup>
import NotificationBanner from './NotificationBanner.vue';
import LanguageSelector from './LanguageSelector.vue';
</script>

<template>
    <div class="iati-mobile-nav js-iati-mobile-nav">
        <div class="iati-mobile-nav__overlay js-iati-mobile-overlay"></div>
        <nav class="iati-mobile-nav__menu">
            <div class="iati-mobile-nav__header">
                <h2 class="iati-mobile-nav__label">
                    {{ $t('message.header_menu') }}
                </h2>

                <button
                    class="iati-menu-toggle iati-menu-toggle--close js-iati-menu-toggle-close"
                >
                    <span>{{ $t('message.header_close') }}</span>
                </button>
            </div>
            <ul class="">
                <li class="iati-mobile-nav__item">
                    <a href="/" class="iati-mobile-nav__link">{{
                        $t('message.header_tool_home')
                    }}</a>
                </li>
                <li class="iati-mobile-nav__item">
                    <a href="/advanced" class="iati-mobile-nav__link">{{
                        $t('message.advanced_search')
                    }}</a>
                </li>
                <li class="iati-mobile-nav__item">
                    <a
                        href="https://developer.iatistandard.org/api-details#api=datastore"
                        class="iati-mobile-nav__link"
                        >{{ $t('message.api') }}</a
                    >
                </li>
            </ul>
            <ul class="">
                <li class="iati-mobile-nav__item">
                    <a
                        :href="
                            'https://iatistandard.org/' +
                            $i18n.locale +
                            '/about/'
                        "
                        class="iati-mobile-nav__link"
                        >{{ $t('message.header_about_iati') }}</a
                    >
                </li>
                <li class="iati-mobile-nav__item">
                    <a
                        :href="
                            'https://iatistandard.org/' +
                            $i18n.locale +
                            '/using-data/'
                        "
                        class="iati-mobile-nav__link"
                        >{{ $t('message.header_use_data') }}</a
                    >
                </li>
                <li class="iati-mobile-nav__item">
                    <a
                        :href="
                            'https://iatistandard.org/' +
                            $i18n.locale +
                            '/guidance/publishing-data/'
                        "
                        class="iati-mobile-nav__link"
                    >
                        {{ $t('message.header_publish_data') }}
                    </a>
                </li>
                <li class="iati-mobile-nav__item">
                    <a
                        href="https://iatistandard.org/guidance/get-support/"
                        class="iati-mobile-nav__link"
                    >
                        {{ $t('message.header_contact') }}
                    </a>
                </li>
                <li class="iati-mobile-nav__item">
                    <a
                        :href="
                            'https://docs.datastore.iatistandard.org/' +
                            $i18n.locale +
                            '/latest'
                        "
                        class="iati-mobile-nav__link"
                        >{{ $t('message.header_help_docs') }}</a
                    >
                </li>
            </ul>
        </nav>
    </div>

    <header :aria-label="$t('message.main_header')" class="iati-header">
        <div class="iati-header__section iati-header__section--first">
            <div class="iati-header__container">
                <a
                    href="https://iatistandard.org/"
                    aria-label="Go to IATI homepage"
                >
                    <img
                        class="iati-header__logo"
                        alt=""
                        src="https://iati.github.io/design-system/assets/logo-colour-Bag5CeA4.svg"
                    />
                </a>

                <nav
                    :aria-label="$t('message.navigation')"
                    class="iati-header__general-nav"
                >
                    <ul class="iati-piped-list">
                        <li>
                            <a
                                :href="
                                    'https://iatistandard.org/' +
                                    $i18n.locale +
                                    '/about/'
                                "
                                >{{ $t('message.header_about_iati') }}</a
                            >
                        </li>
                        <li>
                            <a
                                :href="
                                    'https://iatistandard.org/' +
                                    $i18n.locale +
                                    '/using-data/'
                                "
                                >{{ $t('message.header_use_data') }}</a
                            >
                        </li>
                        <li>
                            <a
                                :href="
                                    'https://iatistandard.org/' +
                                    $i18n.locale +
                                    '/guidance/publishing-data/'
                                "
                            >
                                {{ $t('message.header_publish_data') }}
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://iatistandard.org/guidance/get-support/"
                            >
                                {{ $t('message.header_contact') }}
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div
            class="iati-header__section iati-header__section--last iati-brand-background"
        >
            <div class="iati-header__container iati-brand-background__content">
                <div class="iati-header__actions">
                    <LanguageSelector />
                    <a
                        :href="
                            'https://docs.datastore.iatistandard.org/' +
                            $i18n.locale +
                            '/latest'
                        "
                        class="iati-button iati-button--light hide--mobile-nav"
                    >
                        <span>{{ $t('message.header_help_docs') }}</span>
                        <i class="iati-icon iati-icon--info"></i>
                    </a>

                    <button
                        class="iati-menu-toggle iati-menu-toggle--open js-iati-menu-toggle-open"
                    >
                        <span class="iati-menu-toggle__label">{{
                            $t('message.header_menu')
                        }}</span>
                    </button>
                </div>

                <div class="iati-header-title">
                    <p class="iati-header-title__eyebrow">
                        {{ $t('message.header_iati_tools') }}
                    </p>
                    <p class="iati-header-title__heading">
                        {{ $t('message.datastore_search') }}
                    </p>
                </div>

                <div class="iati-header__nav">
                    <nav>
                        <ul class="iati-tool-nav">
                            <li>
                                <router-link
                                    to="/"
                                    class="iati-tool-nav-link"
                                    data-cy="header-search"
                                    >{{
                                        $t('message.datastore_search')
                                    }}</router-link
                                >
                            </li>
                            <li>
                                <router-link
                                    to="/advanced"
                                    class="iati-tool-nav-link"
                                    data-cy="header-advanced-search"
                                    >{{
                                        $t('message.advanced_search')
                                    }}</router-link
                                >
                            </li>
                            <li>
                                <a
                                    href="https://developer.iatistandard.org/api-details#api=datastore"
                                    class="iati-tool-nav-link"
                                    >{{ $t('message.api') }}</a
                                >
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
            <NotificationBanner />
        </div>
    </header>
</template>
