<script setup>
import {
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
import { inject, ref, reactive, watch } from 'vue';
import FilterBooleanInput from '../components/FilterBooleanInput.vue';
import FilterComboInput from '../components/FilterComboInput.vue';
import FilterDateInput from '../components/FilterDateInput.vue';
import FilterLatLongInput from '../components/FilterLatLongInput.vue';
import FilterNumberInput from '../components/FilterNumberInput.vue';
import FilterSelectInput from '../components/FilterSelectInput.vue';
import FilterTextInput from '../components/FilterTextInput.vue';

const props = defineProps({ filter: { type: Object, default: () => {} } });
const emit = defineEmits(['change', 'delete']);

const global = inject('global');

const filter = reactive(props.filter);
const select = ref('');
const selectedOption = ref();

const getSelectedOption = (label) =>
    label ? global.state.fieldOptions.find((item) => item.label === label) : null;
const updateFilterFromSelectedOption = (option) => {
    filter.selectedOption = option;
    filter.type = option.type;
    filter.desc = option.description;
    filter.field = option.field;

    emit('change', filter);
};
const onChange = (value, isOperator = false) => {
    if (isOperator) {
        filter.operator = value;
    } else {
        filter.value = value;
    }

    emit('change', filter);
};

watch(select, () => {
    selectedOption.value = getSelectedOption(select.value);
    updateFilterFromSelectedOption(selectedOption.value);
});
</script>
<template>
    <div class="grid grid-cols-7 gap-3 mt-3">
        <div class="col-span-3">
            <select
                v-model="select"
                class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            >
                <option ref="default-option" disabled value="" selected>
                    {{ $t('message.select_field') }}
                </option>
                <option
                    v-for="filterOption in global.state.fieldOptions"
                    :key="filterOption.field"
                    :disabled="filterOption.disabled === true"
                >
                    {{ filterOption.label }}
                </option>
            </select>
        </div>

        <div v-if="selectedOption" class="col-span-3">
            <FilterTextInput
                v-if="selectedOption.type === 'text'"
                :filter="filter"
                @change="onChange($event.target.value)"
            />
            <FilterLatLongInput
                v-if="selectedOption.type === 'latlon'"
                :filter="filter"
                @change="(value) => onChange(value)"
            />
            <FilterBooleanInput
                v-if="selectedOption.type === 'boolean'"
                :filter="filter"
                @change="(value) => onChange(value)"
            />
            <FilterNumberInput
                v-if="selectedOption.type === 'number' || selectedOption.type === 'integer'"
                :filter="filter"
                @change-operator="(operator) => onChange(operator, true)"
                @change-value="(value) => onChange(value)"
            />
            <FilterSelectInput
                v-if="selectedOption.type === 'select'"
                :filter="filter"
                @change-value="onChange($event.target.value)"
                @change-operator="(operator) => onChange(operator, true)"
            />
            <FilterComboInput
                v-if="selectedOption.type === 'combo'"
                :filter="filter"
                @change-operator="(operator) => onChange(operator, true)"
                @change-value="onChange($event.target.value)"
            />
            <FilterDateInput
                v-if="selectedOption.type === 'date'"
                :filter="filter"
                @change-operator="(operator) => onChange(operator, true)"
                @change-value="(value) => onChange(value)"
            />
        </div>
        <div class="col-span-1">
            <div class="py-2 inline-flex items-center -ml-1">
                <XCircleIcon class="h-6 mr-1 cursor-pointer" @click="emit('delete', filter)" />
                <a
                    v-if="selectedOption && ['select', 'combo'].includes(selectedOption.type)"
                    type="link"
                    target="_blank"
                    aria-label="Link to codelist describe on iati website"
                    class="float-left has-tooltip"
                    :href="global.state.codelistURL + selectedOption.codelist_name"
                >
                    <ArrowTopRightOnSquareIcon class="h-5 mr-1 -mt-[1px]" />
                </a>
                <button class="has-tooltip" type="button" aria-label="Hover for description">
                    <QuestionMarkCircleIcon v-if="filter.desc" class="h-5" />
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
