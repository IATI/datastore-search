<script setup>
import DownloadButtons from './DownloadButtons.vue';
import SortButtons from './SortButtons.vue';

const props = defineProps({
    count: { type: Number, default: null },
    showDownloadButtons: { type: Boolean, default: true },
});

const formatNumber = (value) => new Intl.NumberFormat('en-us').format(value);
</script>

<template>
    <div class="text-left py-3 border">
        <div class="mx-5 pb-4">
            <div class="mt-1">
                <!-- eslint-disable vue/no-v-html -->
                <span
                    class="my-2"
                    v-html="
                        $t('message.found_matching_iati_activities', {
                            count: formatNumber(props.count),
                        })
                    "
                ></span>
                <!-- eslint-enable vue/no-v-html -->
            </div>
        </div>
        <div class="mx-5">
            <SortButtons class="mr-4" />
            <DownloadButtons v-if="props.showDownloadButtons" />
        </div>
    </div>
</template>
