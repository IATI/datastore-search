<script setup>
import { inject } from 'vue';
import { PlusCircleIcon } from '@heroicons/vue/20/solid';
import { ArrowDownIcon } from '@heroicons/vue/20/solid';
import { ArrowUpIcon } from '@heroicons/vue/20/solid';
import { PlayIcon } from '@heroicons/vue/20/solid';
import AppButton from '../components/AppButton.vue';

const global = inject('global');

const emits = defineEmits(['run']);
</script>

<template>
    <div id="buttons w-full">
        <div
            v-if="global.state.filters.length > 0"
            class="border-solid border-t border-b py-5 flex justify-between w-full px-4 content-end pr-0"
        >
            <AppButton
                :aria-label="$t('message.add_aria')"
                variant="yellow"
                size="sm"
                class="hidden"
                @click="global.addFilter()"
            >
                <PlusCircleIcon class="h-3.5 w-5 text-grey-300 mr-1 relative" />
                <span class="uppercase">{{ $t('message.add') }}</span>
            </AppButton>
            <div class="hidden">
                <AppButton
                    :aria-label="$t('message.export_aria')"
                    variant="red"
                    class="mr-1"
                    size="sm"
                    @click="global.toggleExportModal()"
                >
                    <ArrowDownIcon class="h-3.5 w-5 text-grey-300 mr-1 relative" />
                    <span class="uppercase">{{ $t('message.export') }}</span>
                </AppButton>
                <AppButton
                    :aria-label="$t('message.import_aria')"
                    variant="red"
                    class="ml-1"
                    size="sm"
                    @click="global.toggleImportModal()"
                >
                    <ArrowUpIcon class="h-3.5 w-5 text-grey-300 mr-1 relative" />
                    <span class="uppercase">{{ $t('message.import') }}</span>
                </AppButton>
            </div>
            <AppButton
                :aria-label="$t('message.run_aria')"
                variant="green"
                size="sm"
                class="float-right"
                @click="emits('run')"
            >
                <PlayIcon class="h-3.5 w-5 text-grey-300 mr-1 relative" />
                <span class="uppercase">{{ $t('message.run') }}</span>
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
