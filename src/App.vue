<script setup>
import AppHeader from './components/AppHeader.vue';
import LinkedInLogo from './components/LinkedInLogo.vue';
import TwitterLogo from './components/TwitterLogo.vue';
</script>

<template>
    <div class="h-screen min-w-fit sm:min-w-0">
        <AppHeader />
        <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
            <div class="flex-grow"><router-view /></div>
        </div>
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
                                :href="
                                    'https://iatistandard.org/' +
                                    global.state.language +
                                    '/privacy-policy/'
                                "
                                >{{ $t('message.privacy') }}</a
                            >
                        </p>
                        <p class="inline-block float-left mt-1 mr-5">
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
import Plausible from 'plausible-tracker';
import { inject } from 'vue';
import global from './global';

export default {
    components: {},
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
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
.text-underline {
    text-decoration: underline;
}
.text-blue {
    color: rgb(37 99 235 / 1);
}
</style>
