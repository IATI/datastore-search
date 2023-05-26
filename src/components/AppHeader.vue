<script setup>
import NotificationBanner from './NotificationBanner.vue';
import IatiLogo from './IatiLogo.vue';
import LanguageSelector from './LanguageSelector.vue';
</script>

<template>
    <header :aria-label="$t('message.main_header')" class="bg-iati-grey">
        <div class="text-white ml-auto mr-auto max-w-[1200px] relative">
            <div class="md:mx-5 md:flex">
                <div class="flex justify-center md:inline-block my-2 w-full sm:w-1/2 md:w-1/3">
                    <a href="https://iatistandard.org" :title="$t('message.iati_standard_website')">
                        <IatiLogo colour="#fff" class="h-12" />
                    </a>
                </div>
                <div class="inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3">
                    <h1 class="text-3xl mt-1 md:mt-4 pb-3">
                        <a href="/">
                            <b>{{ $t('message.datastore_search') }}</b>
                        </a>
                    </h1>
                </div>

                <div
                    class="inline-flex items-center mx-2 md:mx-0 justify-around md:justify-between h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3"
                >
                    <nav :aria-label="$t('message.navigation')" class="md:ml-10 md:mt-5 text-xl">
                        <router-link
                            v-if="$route.path === '/advanced'"
                            to="/"
                            class="hover:underline"
                            >{{ $t('message.simple_search') }}</router-link
                        >
                        <router-link
                            v-if="$route.path !== '/advanced' && $route.path !== '/'"
                            to="/advanced"
                            class="hover:underline"
                            >{{ $t('message.advanced_search') }}</router-link
                        >
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
                        <a class="hover:underline border-l pl-2 ml-2" href="/about">{{
                            $t('message.about')
                        }}</a>
                    </nav>
                    <LanguageSelector />
                </div>
            </div>
            <NotificationBanner />
        </div>
    </header>
</template>
