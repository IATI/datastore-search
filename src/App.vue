<script setup>
import IatiLogo from './components/IatiLogo.vue';
import TwitterLogo from './components/TwitterLogo.vue';
import LinkedInLogo from './components/LinkedInLogo.vue';
import NotificationBanner from './components/NotificationBanner.vue';
import { LanguageIcon } from '@heroicons/vue/20/solid';
</script>

<template>
    <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
        <header :aria-label="$t('message.main_header')">
            <div class="bg-iati-grey text-white">
                <div class="mx-5">
                    <div class="inline-block my-2 align-middle w-full sm:w-1/2 md:w-1/3">
                        <a
                            href="https://iatistandard.org"
                            :title="$t('message.iati_standard_website')"
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
        <div class="flex-grow"><router-view /></div>
        <footer class="bg-iati-grey text-white text-center text-sm">
            <div class="mx-auto">
                <div class="py-4 px-12 xl:max-w-[75%] mx-auto">
                    <div class="inline-block float-left flex mt-1 w-1/3">
                        <p>
                            {{
                                $t('message.datastore_search_is_part_of_the_iati_unified_platform')
                            }}
                        </p>
                    </div>
                    <div class="inline-block float-left mt-1 mb-1 pl-5 w-1/3">
                        <div class="text-left flex">
                            <span class="w-full">{{ $t('message.iati_data_access_tools') }}:</span>
                            <ul class="w-full ml-3">
                                <li class="flex items-center">
                                    <a href="https://countrydata.iatistandard.org/">• CDFD</a>
                                </li>
                                <li class="flex items-center">
                                    <a href="https://d-portal.org/">• d-Portal</a>
                                </li>
                                <li class="flex items-center">
                                    <a href="https://datastore.iatistandard.org/"
                                        >• Datastore Search</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="float-right flex">
                        <p class="inline-block align-top mt-1 mr-5">
                            <a
                                class="hover:underline"
                                role="link"
                                :href="
                                    'https://iatistandard.org/' +
                                    global.state.language +
                                    '/privacy-policy/'
                                "
                                >{{ $t('message.privacy') }}</a
                            >
                        </p>
                        <p class="inline-block align-top mt-1 mr-5">
                            <a
                                class="hover:underline"
                                role="link"
                                :href="
                                    'https://iatistandard.org/' +
                                    global.state.language +
                                    '/contact/'
                                "
                                >{{ $t('message.contact') }}</a
                            >
                        </p>
                        <a
                            class="inline-block ml-2"
                            role="link"
                            :aria-label="$t('message.twitter_aria')"
                            href="https://twitter.com/IATI_aid"
                        >
                            <TwitterLogo class="w-8 h-8" />
                        </a>
                        <a
                            class="inline-block ml-5"
                            role="link"
                            :aria-label="$t('message.linkedin_aria')"
                            href="https://www.linkedin.com/company/international-aid-transparency-initiative/"
                        >
                            <LinkedInLogo class="w-8 h-8" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import global from './global';
import { inject } from 'vue';
import Plausible from 'plausible-tracker';

export default {
    components: {
        NotificationBanner,
    },
    provide: { global },
    setup() {
        const plausible = inject('plausible');
        return {
            plausible,
        };
    },
    mounted() {
        const { trackEvent } = Plausible();

        const responseStart = performance.getEntriesByType('navigation')[0].responseStart;
        trackEvent('TTFB', {
            props: {
                event_category: 'PageSpeed',
                event_label: responseStart,
            },
        });
    },
};
</script>
