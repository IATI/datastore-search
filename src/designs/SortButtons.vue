<template>
    <div>
        <b class="block 2xl:inline">{{ $t('message.sort') }}:</b>
        <button
            v-for="fieldObj in global.sortFields"
            :key="fieldObj"
            :aria-label="
                fieldObj.label +
                ' ' +
                (global.state.searchOrderField == fieldObj.field
                    ? global.state.searchOrderDirection
                    : '')
            "
            class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block inline mb-1"
            @click="global.sortResults(fieldObj.field)"
        >
            <span>{{ fieldObj.verbose }}</span>
            <span v-if="global.state.searchOrderField == fieldObj.field">
                <ChevronDownIcon
                    v-if="global.state.searchOrderDirection == 'desc'"
                    class="h-5 w-5 text-grey-300 ml-1 inline"
                />
                <ChevronUpIcon
                    v-if="global.state.searchOrderDirection == 'asc'"
                    class="h-5 w-5 text-grey-300 ml-1 inline"
                />
            </span>
            <span v-if="global.state.searchOrderField != fieldObj.field">
                <MinusSmallIcon class="h-5 w-5 text-grey-300 ml-1 inline" />
            </span>
        </button>
    </div>
</template>

<script>
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { ChevronUpIcon } from '@heroicons/vue/20/solid';
import { MinusSmallIcon } from '@heroicons/vue/20/solid';

export default {
    name: 'SortButton',
    components: { ChevronDownIcon, ChevronUpIcon, MinusSmallIcon },
    inject: ['global'],
};
</script>
