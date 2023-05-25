<script setup>
import { LanguageIcon } from '@heroicons/vue/20/solid';
import { inject } from 'vue';
import NotificationBanner from './NotificationBanner.vue';
import IatiLogo from './IatiLogo.vue';

const global = inject('global');
</script>

<template>
    <header :aria-label="$t('message.main_header')">
        <div class="bg-iati-grey text-white">
            <div class="mx-5">
                <div class="inline-block my-2 align-middle w-full sm:w-1/2 md:w-1/3">
                    <a href="https://iatistandard.org" :title="$t('message.iati_standard_website')"
                        ><IatiLogo colour="#fff" class="h-12 mx-auto"
                    /></a>
                    <div class="inline-block h-10 pt-3 mb-3">
                        <LanguageIcon class="h-7 w-7 text-grey-300 float-left mr-1 mt-1" />
                        <select
                            class="h-10 float-left bg-white border rounded w-auto py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                            :value="global.state.language"
                            @change="global.changeLocale($event.target.value)"
                        >
                            <option
                                v-for="(langText, langKey) in global.state.available_locales"
                                :key="langKey"
                                :value="langKey"
                            >
                                <span>{{ langText }}</span>
                            </option>
                        </select>
                    </div>
                </div>
                <div class="inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3">
                    <h1 class="text-4xl mt-5">
                        <a href="/"
                            ><b>{{ $t('message.datastore_search') }}</b></a
                        >
                    </h1>
                </div>

                <div
                    class="hidden md:inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3"
                >
                    <nav :aria-label="$t('message.navigation')" class="ml-10 mt-8 text-xl">
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
                </div>
            </div>
            <NotificationBanner />
        </div>
    </header>
</template>
