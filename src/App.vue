<script setup>
import IatiLogo from './components/IatiLogo.vue';
import TwitterLogo from './components/TwitterLogo.vue';
import LinkedInLogo from './components/LinkedInLogo.vue';
import NotificationBanner from './components/NotificationBanner.vue';
</script>

<template>
    <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
        <header :aria-label="$t('message.main_header')">
            <div class="bg-iati-grey text-white">
                <div class="mx-5">
                    <div class="inline-block h-12 my-2 align-middle w-full sm:w-1/2 md:w-1/3">
                        <a
                            href="https://iatistandard.org"
                            :title="$t('message.iati_standard_website')"
                            ><IatiLogo colour="#fff" class="h-12 mx-auto"
                        /></a>
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
        <footer class="bg-iati-grey text-white text-left text-sm">
            <div class="mx-auto">
                <div class="py-4 px-12 xl:max-w-[75%] mx-auto">
                    <p class="inline-block float-left mt-1">
                        {{ $t('message.datastore_search_is_part_of_the_iati_unified_platform') }}
                    </p>

                    <div class="float-right">
                        <p class="inline-block float-left mt-1 mr-5">
                            <a
                                class="hover:underline"
                                role="link"
                                href="https://iatistandard.org/en/privacy-policy/"
                                >{{ $t('message.privacy') }}</a
                            >
                        </p>
                        <p class="inline-block float-left mt-1 mr-5">
                            <a
                                class="hover:underline"
                                role="link"
                                href="https://iatistandard.org/en/contact/"
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

        const requestStart = performance.getEntriesByType('navigation')[0].requestStart;
        trackEvent('TTFB', {
            props: {
                event_category: 'PageSpeed',
                event_label: requestStart,
            },
        });
    },
};
</script>
