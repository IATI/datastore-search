<script setup>
import NotificationBanner from './NotificationBanner.vue';
import LanguageSelector from './LanguageSelector.vue';
</script>

<template>
    <header :aria-label="$t('message.main_header')" class="bg-iati-grey">
        <div class="text-white ml-auto mr-auto max-w-[1200px] relative">
            <div class="lg:mx-5 lg:flex">
                <div class="lg:inline-block my-2 w-full lg:w-1/3">
                    <a
                        href="https://iatistandard.org"
                        :title="$t('message.iati_standard_website')"
                        class="bg-logo-white h-12 bg-contain block bg-no-repeat lg:bg-left bg-center"
                    ></a>
                </div>
                <div
                    class="inline-block h-full my-2 align-middle w-full md:w-1/2 lg:w-1/3"
                >
                    <h1 class="text-3xl mt-1 md:mt-4 pb-3">
                        <a href="/">
                            <b>{{ $t('message.datastore_search') }}</b>
                        </a>
                    </h1>
                </div>

                <div
                    class="inline-flex items-center mx-2 lg:mx-0 justify-around lg:justify-between h-full my-2 align-middle w-full md:w-1/2 lg:w-1/3"
                >
                    <nav
                        :aria-label="$t('message.navigation')"
                        class="md:mt-5 text-xl"
                    >
                        <router-link
                            v-if="$route.path !== '/'"
                            to="/"
                            class="hover:underline"
                        >
                            {{ $t('message.simple_search') }}
                        </router-link>
                        <a
                            v-if="$route.path === '/'"
                            class="hover:underline pl-2 ml-2"
                            href="https://developer.iatistandard.org/api-details#api=datastore"
                            >{{ $t('message.api') }}</a
                        >
                        <a
                            v-if="$route.path !== '/'"
                            class="hover:underline border-l pl-2 ml-2"
                            href="https://developer.iatistandard.org/api-details#api=datastore"
                            >{{ $t('message.api') }}</a
                        >
                        <a
                            class="hover:underline border-l pl-2 ml-2"
                            href="/about"
                        >
                            {{ $t('message.about') }}
                        </a>
                    </nav>
                    <LanguageSelector />
                </div>
            </div>
            <NotificationBanner />
        </div>
    </header>
</template>
