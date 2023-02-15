<script setup>
import { inject } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import { ArrowDownIcon } from '@heroicons/vue/20/solid';
import { ArrowUpIcon } from '@heroicons/vue/20/solid';
import { PlayIcon } from '@heroicons/vue/20/solid';
import AppButton from '../components/AppButton.vue';

const global = inject('global');
</script>

<template>
    <div id="buttons w-full">
        <div
            v-if="global.state.filters.length > 0"
            class="border-solid border-t border-b py-5 flex justify-between mx-3 w-full"
        >
            <AppButton
                :aria-label="$t('message.add_aria')"
                variant="yellow"
                @click="global.addFilter()"
            >
                <PlusCircleIcon class="h-4 w-5 text-grey-300 mr-1 relative top-[3px]" />
                <span>{{ $t('message.add') }}</span>
            </AppButton>
            <div>
                <AppButton
                    :aria-label="$t('message.export_aria')"
                    variant="red"
                    class="mr-1"
                    @click="global.toggleExportModal()"
                >
                    <ArrowDownIcon class="h-4 w-5 text-grey-300 mr-1 relative top-[3px]" />
                    <span>{{ $t('message.export') }}</span>
                </AppButton>
                <AppButton
                    :aria-label="$t('message.import_aria')"
                    variant="red"
                    class="ml-1"
                    @click="global.toggleImportModal()"
                >
                    <ArrowUpIcon class="h-4 w-5 text-grey-300 mr-1 relative top-[3px]" />
                    <span>{{ $t('message.import') }}</span>
                </AppButton>
            </div>
            <AppButton :aria-label="$t('message.run_aria')" variant="green" @click="global.run()">
                <PlayIcon class="h-4 w-5 text-grey-300 mr-1 relative top-[3px]" />
                <span>{{ $t('message.run') }}</span>
            </AppButton>
        </div>
        <div v-if="global.state.filters.length === 0">
            <button
                :aria-label="$t('message.add_aria')"
                class="bg-btn-yellow hover:bg-iati-grey text-white py-1.5 px-5 rounded float-left ml-8 w-2/24 inline-flex"
                @click="global.addFilter()"
            >
                <PlusCircleIcon class="h-4 w-5 text-grey-300 mr-1 float-left relative top-[3px]" />
                <span class="float-left">{{ $t('message.add_filter') }}</span>
            </button>
            <button
                :aria-label="$t('message.import_aria')"
                class="bg-btn-red hover:bg-iati-grey text-white py-1.5 px-5 rounded ml-4 float-left w-3/24 inline-flex"
                @click="global.toggleImportModal()"
            >
                <ArrowUpIcon class="h-4 w-5 text-grey-300 mr-1 float-left relative top-[3px]" />
                <span class="float-left">{{ $t('message.import_filters') }}</span>
            </button>
        </div>
    </div>
</template>
