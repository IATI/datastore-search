<script setup>
import DownloadButtons from './DownloadButtons.vue';
import SortButtons from './SortButtons.vue';

const props = defineProps({
    count: { type: Number, default: null },
    showDownloadButtons: { type: Boolean, default: true },
});
</script>

<template>
    <div class="grid grid-cols-4 gap-2 text-left py-3 border">
        <div class="col-span-4">
            <div class="flex items-center justify-center mt-1">
                <!-- eslint-disable vue/no-v-html -->
                <span
                    class="my-2"
                    v-html="
                        $t('message.found_matching_iati_activities', {
                            count: props.count,
                        })
                    "
                ></span>
                <!-- eslint-enable vue/no-v-html -->
            </div>
        </div>
        <div class="flex items-center justify-center col-span-4">
            <SortButtons class="mr-4" />
            <DownloadButtons v-if="props.showDownloadButtons" />
        </div>
    </div>
</template>
