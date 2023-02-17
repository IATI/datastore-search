<script setup>
import { inject } from 'vue';
import {
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
const props = defineProps({ filter: { type: Object, default: () => {} } });

const global = inject('global');
</script>
<template>
    <div class="grid grid-cols-7 gap-3 mt-3">
        <div class="col-span-3">
            <select
                class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
                <option ref="default-option" disabled value="" selected>
                    {{ $t('message.select_field') }}
                </option>
                <option
                    v-for="filterOption in global.state.fieldOptions"
                    :key="filterOption.field"
                    :selected="global.isFieldOptionSelected(props.filter.id, filterOption.field)"
                    :disabled="filterOption.disabled === true"
                >
                    {{ filterOption.label }}
                </option>
            </select>
        </div>

        <div class="col-span-3">
            <input
                type="text"
                :class="{ 'border-red-400': filter.valid === false }"
                class="h-10 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                :placeholder="$t('message.search_term')"
                :value="filter.value"
                @input="global.changeFilter(filter.id, 'value', $event.target.value)"
            />
        </div>
        <div class="col-span-1">
            <div class="py-2 inline-flex items-center -ml-1">
                <XCircleIcon class="h-6 mr-1" />
                <ArrowTopRightOnSquareIcon class="h-5 mr-1 -mt-[1px]" />
                <QuestionMarkCircleIcon class="h-5" />
            </div>
        </div>
    </div>
</template>
