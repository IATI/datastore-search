<script setup>
import { inject, computed } from 'vue';

import { BarsArrowDownIcon, BarsArrowUpIcon } from '@heroicons/vue/20/solid';

const props = defineProps({ disabled: { type: Boolean, default: false } });
const global = inject('global');

const selected = computed({
    get() {
        return global.sortFields.find((item) => item.field === global.state.searchOrderField) || '';
    },
    set(value) {
        global.sortResults(value.field);
    },
});
</script>

<template>
    <div class="flex min-w-[35%] max-w-[50%] mb-2">
        <v-select
            v-model="selected"
            :options="global.sortFields"
            :placeholder="$t('message.sort')"
            :allow-empty="false"
            :selected-label="''"
            :select-label="''"
            :deselect-label="''"
            track-by="field"
            label="label"
            :disabled="props.disabled"
        />
        <button
            v-if="selected"
            class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-2 px-2.5 rounded ml-2 w-3/24 block disabled:opacity-10"
            :aria-label="`${selected.label} ${
                global.state.searchOrderField == selected.field
                    ? global.state.searchOrderDirection
                    : ''
            }`"
            :disabled="props.disabled"
            @click="global.sortResults(selected.field)"
        >
            <BarsArrowDownIcon
                v-if="global.state.searchOrderDirection == 'desc'"
                class="h-5 w-5 text-grey-300 ml-0 inline"
            />
            <BarsArrowUpIcon
                v-if="global.state.searchOrderDirection == 'asc'"
                class="h-5 w-5 text-grey-300 ml-0 inline"
            />
        </button>
    </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
