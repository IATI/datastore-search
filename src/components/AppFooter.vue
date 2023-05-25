<script setup>
import { inject } from 'vue';
import LinkedInLogo from './LinkedInLogo.vue';
import TwitterLogo from './TwitterLogo.vue';

const global = inject('global');
</script>

<template>
    <footer class="bg-iati-grey text-white text-left text-sm">
        <div class="mx-auto">
            <div class="py-4 px-12 xl:max-w-[75%] mx-auto flex justify-between align-middle">
                <p class="inline-block float-left mt-1">
                    {{ $t('message.datastore_search_is_part_of_the_iati_unified_platform') }}
                </p>

                <div class="flex align-middle">
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
                                'https://iatistandard.org/' + global.state.language + '/contact/'
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
</template>
