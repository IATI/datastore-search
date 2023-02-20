<script setup>
import {
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
import { inject } from 'vue';
import FilterBooleanInput from '../components/FilterBooleanInput.vue';
import FilterComboInput from '../components/FilterComboInput.vue';
import FilterDateInput from '../components/FilterDateInput.vue';
import FilterLatLongInput from '../components/FilterLatLongInput.vue';
import FilterNumberInput from '../components/FilterNumberInput.vue';
import FilterSelectInput from '../components/FilterSelectInput.vue';
import FilterTextInput from '../components/FilterTextInput.vue';

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
            <FilterTextInput
                v-if="global.isFieldType(filter.field, 'text')"
                :filter="filter"
                @change="global.changeFilter(filter.id, 'value', $event.target.value)"
            />
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
            <FilterComboInput v-if="global.isFieldType(filter.field, 'combo')" :filter="filter" />
            <FilterDateInput v-if="global.isFieldType(filter.field, 'date')" :filter="filter" />
        </div>
        <div class="col-span-1">
            <div class="py-2 inline-flex items-center -ml-1">
                <XCircleIcon class="h-6 mr-1" @click="global.removeFilter(filter.id)" />
                <a
                    v-if="
                        global.isFieldType(filter.field, 'select') ||
                        global.isFieldType(filter.field, 'combo')
                    "
                    type="link"
                    target="_blank"
                    aria-label="Link to codelist describe on iati website"
                    class="float-left has-tooltip"
                    :href="global.state.codelistURL + filter.selectedOption.codelist_name"
                >
                    <ArrowTopRightOnSquareIcon class="h-5 mr-1 -mt-[1px]" />
                </a>
                <button class="has-tooltip" type="button" aria-label="Hover for description">
                    <QuestionMarkCircleIcon v-if="global.isFieldSelected(filter.id)" class="h-5" />
                    <span
                        role="definition"
                        class="tooltip border rounded text-white p-2 ml-9 -mt-8 bg-iati-grey"
                    >
                        {{ filter.desc }}
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>
