<script setup>
import { ArrowDownIcon } from '@heroicons/vue/solid';
</script>

<template>
    <div
        v-if="global.state.export.showModal"
        role="dialog"
        class="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
    >
        <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
            <h2 class="text-2xl">{{ $t('message.export_filters') }}</h2>

            <div class="mt-1">
                <p
                    class="mb-4 mt-2 text-left text-md"
                    v-html="$t('message.export_para1')"
                ></p>
                <p
                    class="mb-4 mt-2 text-left text-sm"
                    v-html="$t('message.export_para2')"
                ></p>
                <div class="flex justify-between">
                    <button
                        class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded"
                        @click="global.toggleExportModal()"
                    >
                        {{ $t('message.cancel') }}
                    </button>
                    <button
                        class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
                        data-cabin-event="Export filters"
                        @click="global.exportFilters()"
                    >
                        <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1" />
                        <span v-if="!global.state.export.fileLoading">{{
                            $t('message.export')
                        }}</span>
                        <div
                            v-if="global.state.export.fileLoading"
                            style="border-top-color: transparent"
                            class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin"
                        ></div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExportModal',
    inject: ['global'],
};
</script>
