<script setup>
import { inject } from 'vue';
import {
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
import FilterTextInput from '../components/FilterTextInput.vue';
import FilterLatLongInput from '../components/FilterLatLongInput.vue';
import FilterBooleanInput from '../components/FilterBooleanInput.vue';
import FilterNumberInput from '../components/FilterNumberInput.vue';
import FilterSelectInput from '../components/FilterSelectInput.vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });

const global = inject('global');
</script>
<template>
    <div class="grid grid-cols-7 gap-3 mt-3">
        <div class="col-span-3">
            <select
                class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                @change="global.changeFilter(filter.id, 'field', $event.target.value)"
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
            <FilterTextInput v-if="global.isFieldType(filter.field, 'text')" :filter="filter" />
            <FilterLatLongInput
                v-if="global.isFieldType(filter.field, 'latlon')"
                :filter="filter"
            />
            <FilterBooleanInput
                v-if="global.isFieldType(filter.field, 'boolean')"
                :filter="filter"
            />
            <FilterNumberInput
                v-if="
                    global.isFieldType(filter.field, 'number') ||
                    global.isFieldType(filter.field, 'integer')
                "
                :filter="filter"
            />
            <FilterSelectInput v-if="global.isFieldType(filter.field, 'select')" :filter="filter" />
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
