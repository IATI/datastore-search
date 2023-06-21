<script setup>
import { inject, ref } from 'vue';
import { ArrowPathRoundedSquareIcon, PlusCircleIcon } from '@heroicons/vue/20/solid';
import { ArrowDownIcon } from '@heroicons/vue/20/solid';
import { ArrowUpIcon } from '@heroicons/vue/20/solid';
import { PlayIcon } from '@heroicons/vue/20/solid';
import AppButton from '../components/AppButton.vue';

const global = inject('global');
const resetStatus = ref('waiting');
const timeoutId = ref(null);

const emits = defineEmits(['run']);
const onReset = () => {
    if (resetStatus.value === 'waiting') {
        resetStatus.value = 'awaiting-confirmation';
        timeoutId.value = window.setTimeout(() => {
            resetStatus.value = 'waiting';
        }, 3000);

        return;
    } else if (resetStatus.value === 'awaiting-confirmation') {
        window.clearTimeout(timeoutId.value);
        timeoutId.value = null;
        global.resetFilters();
        resetStatus.value = 'waiting';

        return;
    }
    resetStatus.value = 'waiting';
    return;
};
</script>

<template>
    <div id="buttons w-full">
        <div
            v-if="global.state.filters.length > 0"
            class="border-solid border-t border-b py-5 flex flex-col lg:flex-row items-start justify-between w-full px-0 content-end pr-0"
        >
            <div class="mb-3 lg:mb-0">
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
            <div>
                <AppButton
                    :aria-label="$t('message.add_aria')"
                    variant="yellow"
                    size="sm"
                    class="mr-2"
                    data-cy="reset-filters"
                    @click="onReset"
                >
                    <ArrowPathRoundedSquareIcon class="h-3.5 w-5 text-grey-300 mr-1 relative" />
                    <span class="uppercase">
                        {{
                            resetStatus === 'waiting'
                                ? $t('message.reset')
                                : $t('message.confirm_reset')
                        }}
                    </span>
                </AppButton>
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
        </div>
        <div v-if="global.state.filters.length === 0">
            <button
                :aria-label="$t('message.add_aria')"
                class="bg-btn-yellow hover:bg-iati-grey text-white py-1.5 px-5 rounded float-left ml-2 w-2/24 inline-flex"
                data-cy="build-query"
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
