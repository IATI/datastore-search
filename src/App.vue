<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
    <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
        <AppHeader />
        <div class="flex-grow ml-auto mr-auto max-w-[1200px] relative w-full">
            <router-view />
        </div>
        <AppFooter />
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

        const responseStart =
            performance.getEntriesByType('navigation')[0].responseStart;
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
