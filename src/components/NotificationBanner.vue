<script setup>
import { QuestionMarkCircleIcon } from '@heroicons/vue/20/solid';
</script>

<template>
    <div v-if="showBanner" class="bg-yellow-200 flex items-center justify-center">
        <p class="p-1 text-black flex items-center">
            <button type="button" aria-label="Hover for more detail" @click="toggleTooltip">
                <QuestionMarkCircleIcon class="h-7 w-7 text-grey-300 mx-1" /><span
                    role="definition"
                    class="tooltip border rounded text-white p-2 ml-9 -mt-8 bg-iati-grey"
                    :class="{
                        'visible z-50 translate-y-12 -translate-x-8 md:-translate-x-40':
                            showTooltip === true,
                        invisible: showTooltip === false,
                    }"
                    >During planned maintenance you may not receive search results as expected.
                    Please come back later to run your queries.</span
                >
            </button>
            Planned Maintenance - Monday 27 March 2023 - 1400-1800 BST (London)
        </p>
    </div>
</template>

<script>
export default {
    name: 'NotificationBanner',
    data() {
        return {
            showTooltip: false,
        };
    },
    computed: {
        showBanner() {
            return import.meta.env.VUE_ENV_SHOW_MAINTENANCE_BANNER === 'true';
        },
    },
    methods: {
        toggleTooltip() {
            this.showTooltip = !this.showTooltip;
        },
    },
};
</script>
