<script setup>
import DownloadButtons from './DownloadButtons.vue';
import SortButtons from './SortButtons.vue';
import { formatNumber } from '../utils';

const props = defineProps({
    count: { type: Number, default: null },
    showDownloadButtons: { type: Boolean, default: true },
    processing: { type: Boolean, default: false },
});
</script>

<template>
    <div class="text-left py-3 border">
        <div class="mx-5 pb-4">
            <div class="mt-1">
                <!-- eslint-disable vue/no-v-html -->
                <span
                    class="my-2"
                    v-html="
                        props.count
                            ? $t('message.found_matching_iati_activities', {
                                  count: formatNumber(props.count),
                              })
                            : 'Loading ...'
                    "
                ></span>
                <!-- eslint-enable vue/no-v-html -->
            </div>
        </div>
        <div class="mx-5 flex">
            <SortButtons class="mr-4" :disabled="props.processing" />
            <DownloadButtons v-if="props.showDownloadButtons" />
        </div>
    </div>
</template>
