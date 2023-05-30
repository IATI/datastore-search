<script setup>
import {
    ArrowTopRightOnSquareIcon,
    QuestionMarkCircleIcon,
    XCircleIcon,
} from '@heroicons/vue/24/outline';
import { computed, inject, ref, reactive, watch } from 'vue';
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

let filter = reactive(props.filter);
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
const filterOptions = computed(() =>
    global.state.fieldOptions
        .filter(
            (option) => option.type !== 'grouping' && option.label !== 'Grouping:' // exclude grouping(bracket) options
        )
        .map((option) => ({ ...option, $isDisabled: option.disabled }))
);
const onChange = (value, isOperator = false) => {
    if (isOperator) {
        filter.operator = value;
    } else {
        filter.value = value;
    }

    emit('change', filter);
};

watch(
    () => props.filter,
    () => {
        filter = reactive(props.filter);
    }
);
watch(select, () => {
    selectedOption.value = getSelectedOption(select.value.label);
    updateFilterFromSelectedOption(selectedOption.value);
});
</script>
<template>
    <div class="grid grid-cols-7 gap-3 mt-3">
        <div class="col-span-3">
            <v-select
                v-model="select"
                :options="filterOptions"
                :placeholder="$t('message.select_field')"
                :allow-empty="false"
                :selected-label="''"
                :select-label="''"
                :deselect-label="''"
                track-by="field"
                label="label"
                class="filter-group-item"
            />
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

            <p v-if="!filter.valid" id="validation" class="text-sm text-red-600">
                {{ filter.validationMessage }}
            </p>
        </div>
        <div class="col-span-1">
            <div class="py-2 inline-flex items-center -ml-1">
                <XCircleIcon class="h-6 mr-1 cursor-pointer" @click="emit('delete', filter)" />
                <a
                    v-if="selectedOption && ['select', 'combo'].includes(selectedOption.type)"
                    type="link"
                    target="_blank"
                    aria-label="Link to codelist describe on iati website"
                    class="float-left"
                    :href="global.state.codelistURL + selectedOption.codelist_name"
                >
                    <ArrowTopRightOnSquareIcon class="h-5 mr-1 -mt-[1px]" />
                </a>
                <button
                    v-if="filter.desc"
                    type="button"
                    aria-label="Hover for description"
                    :data-tooltip="filter.desc"
                    data-position="bottom right"
                    data-size="md"
                >
                    <QuestionMarkCircleIcon class="h-5" />
                </button>
            </div>
        </div>
    </div>
</template>

<style>
.filter-group-item .multiselect__content-wrapper {
    width: 350px;
    margin-top: 2px;
    border-top: 1px solid #e8e8e8;
}

.filter-group-item .multiselect__single {
    white-space: nowrap;
    overflow: hidden;
}

.filter-group-item .multiselect__option {
    white-space: pre-wrap;
    line-height: 1.3rem;
}
</style>
