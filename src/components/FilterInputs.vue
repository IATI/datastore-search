<script setup>
import Datepicker from 'vue3-datepicker';
import { TrashIcon } from '@heroicons/vue/solid';
import { QuestionMarkCircleIcon, ExternalLinkIcon } from '@heroicons/vue/solid';
</script>

<template>
    <div class="grid grid-cols-7 gap-4">
        <div
            v-if="!global.isFilterFirstInChain(filter.id) && !global.filterIsGrouping(filter.id)"
            class="inline-flex"
            role="toolbar"
        >
            <button
                :class="{ 'bg-blue-300': filter.joinOperator === 'AND' }"
                type="button"
                class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="global.changeFilter(filter.id, 'joinOperator', 'AND')"
            >
                {{ $t('message.and') }}
            </button>
            <button
                :class="{ 'bg-blue-300': filter.joinOperator === 'OR' }"
                type="button"
                class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="global.changeFilter(filter.id, 'joinOperator', 'OR')"
            >
                {{ $t('message.or') }}
            </button>
        </div>
    </div>
    <div class="grid grid-cols-7 gap-4 my-3">
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
                    :selected="global.isFieldOptionSelected(filter.id, filterOption.field)"
                    :disabled="filterOption.disabled === true"
                >
                    {{ filterOption.label }}
                </option>
            </select>
        </div>

        <div class="col-span-3">
            <!-- Latitude/longitude inputs -->
            <div v-if="global.isFieldType(filter.field, 'latlon')" class="grid grid-cols-8 gap-2">
                <div class="col-span-5">
                    <div class="flex items-center justify-center">
                        <input
                            type="text"
                            disabled="true"
                            :class="{ 'border-red-400': filter.valid === false }"
                            class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                            :placeholder="$t('message.latlon_placeholder')"
                            :value="filter.value"
                            @input="global.changeFilter(filter.id, 'value', $event.target.value)"
                        />
                    </div>
                </div>
                <div class="col-span-3">
                    <div class="inline-flex" role="toolbar">
                        <button
                            type="button"
                            class="bg-blue-300 hover:bg-iati-grey text-white font-bold py-2 px-2 rounded float-right"
                            @click="global.toggleBboxModal(filter.id)"
                        >
                            {{ $t('message.use_map') }}
                        </button>
                    </div>
                </div>
            </div>
            <!-- Grouping inputs -->
            <div
                v-if="global.isFieldType(filter.field, 'grouping')"
                class="inline-flex"
                role="toolbar"
            >
                <button
                    :class="{ 'bg-blue-300': filter.value === '(' }"
                    type="button"
                    class="h-10 border-l border-t border-b rounded-l px-5 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                    @click="global.changeFilter(filter.id, 'value', '(')"
                >
                    (
                </button>
                <button
                    :class="{ 'bg-blue-300': filter.value === ')' }"
                    type="button"
                    class="h-10 border rounded-r px-5 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                    @click="global.changeFilter(filter.id, 'value', ')')"
                >
                    )
                </button>
            </div>
            <!-- Boolean inputs -->
            <div
                v-if="global.isFieldType(filter.field, 'boolean')"
                class="inline-flex"
                role="toolbar"
            >
                <button
                    :class="{ 'bg-blue-300': filter.value === 'true' }"
                    type="button"
                    class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                    @click="global.changeFilter(filter.id, 'value', 'true')"
                >
                    {{ $t('message.true') }}
                </button>
                <button
                    :class="{ 'bg-blue-300': filter.value === 'false' }"
                    type="button"
                    class="h-10 border rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                    @click="global.changeFilter(filter.id, 'value', 'false')"
                >
                    {{ $t('message.false') }}
                </button>
            </div>
            <!-- Number inputs -->
            <input
                v-if="
                    global.isFieldType(filter.field, 'number') ||
                    global.isFieldType(filter.field, 'integer')
                "
                type="number"
                :min="minNumber"
                :max="maxNumber"
                :class="{ 'border-red-400': filter.valid === false }"
                class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                :value="filter.value"
                @input="global.changeFilter(filter.id, 'value', Number($event.target.value))"
            />
            <!-- Text inputs -->
            <input
                v-if="global.isFieldType(filter.field, 'text')"
                type="text"
                :class="{ 'border-red-400': filter.valid === false }"
                class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                :placeholder="$t('message.search_term')"
                :value="filter.value"
                @input="global.changeFilter(filter.id, 'value', $event.target.value)"
            />
            <!-- Select inputs -->
            <div v-if="global.isFieldType(filter.field, 'select')" class="grid grid-cols-8 gap-2">
                <div class="col-span-3">
                    <div class="flex items-center justify-center">
                        <div class="inline-flex" role="toolbar">
                            <button
                                :class="{
                                    'bg-blue-300': filter.operator === 'equals',
                                }"
                                type="button"
                                class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                @click="global.changeFilter(filter.id, 'operator', 'equals')"
                            >
                                ==
                            </button>
                            <button
                                :class="{
                                    'bg-blue-300': filter.operator === 'notEquals',
                                }"
                                type="button"
                                class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                @click="global.changeFilter(filter.id, 'operator', 'notEquals')"
                            >
                                !=
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-span-5">
                    <select
                        v-if="global.isFieldType(filter.field, 'select')"
                        class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        :class="{ 'border-red-400': filter.valid === false }"
                        :value="filter.value"
                        @change="global.changeFilter(filter.id, 'value', $event.target.value)"
                    >
                        <option disabled value="" :selected="global.dropdownStateBlank(filter.id)">
                            {{
                                $t('message.select_from_codes', {
                                    name: filter.selectedOption.codelistMeta.name,
                                })
                            }}
                        </option>
                        <option
                            v-for="(valueOption, index) in filter.selectedOption.options"
                            :key="valueOption.code"
                            :value="valueOption.code"
                            :selected="
                                global.validateDropdownOptions(
                                    filter.id,
                                    index,
                                    filter.selectedOption.options
                                )
                            "
                        >
                            <span
                                >{{ valueOption.code
                                }}{{ valueOption.name ? ' - ' + valueOption.name : null }}</span
                            >
                        </option>
                    </select>
                </div>
            </div>

            <!-- Date inputs -->
            <div v-if="global.isFieldType(filter.field, 'date')" class="grid grid-cols-8 gap-2">
                <div class="col-span-3">
                    <div class="flex items-center justify-center">
                        <div class="inline-flex" role="toolbar">
                            <button
                                :class="{
                                    'bg-blue-300': filter.operator === 'lessThan',
                                }"
                                type="button"
                                class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                @click="global.changeFilter(filter.id, 'operator', 'lessThan')"
                            >
                                &#60;
                            </button>
                            <button
                                :class="{
                                    'bg-blue-300': filter.operator === 'equals',
                                }"
                                type="button"
                                class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                @click="global.changeFilter(filter.id, 'operator', 'equals')"
                            >
                                =
                            </button>
                            <button
                                :class="{
                                    'bg-blue-300': filter.operator === 'greaterThan',
                                }"
                                type="button"
                                class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                                @click="global.changeFilter(filter.id, 'operator', 'greaterThan')"
                            >
                                &#62;
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-span-5">
                    <datepicker
                        :model-value="new Date(filter.value)"
                        class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                        @update:model-value="global.changeFilter(filter.id, 'value', $event)"
                    />
                </div>
            </div>
            <p v-if="filter.valid === false" id="validation" class="text-sm text-red-600">
                {{ filter.validationMessage }}
            </p>
        </div>
        <div class="col-span-1 self-center">
            <div class="grid grid-cols-3 gap-1">
                <a
                    v-if="global.isFieldType(filter.field, 'select')"
                    type="link"
                    target="_blank"
                    aria-label="Link to codelist describe on iati website"
                    class="float-left has-tooltip"
                    :href="global.state.codelistURL + filter.selectedOption.codelist_name"
                >
                    <ExternalLinkIcon class="h-7 w-7 text-grey-500" />
                </a>
                <button
                    type="button"
                    aria-label="Remove filter"
                    class="float-left"
                    @click="global.removeFilter(filter.id)"
                >
                    <TrashIcon class="h-7 w-7 text-grey-300" />
                </button>
                <button
                    v-if="global.isFieldSelected(filter.id)"
                    type="button"
                    aria-label="Hover for description"
                    class="float-left has-tooltip"
                >
                    <QuestionMarkCircleIcon class="h-7 w-7 text-grey-300 mx-1" /><span
                        role="definition"
                        class="tooltip border rounded text-white p-2 ml-9 -mt-8 bg-iati-grey"
                        >{{ filter.desc }}</span
                    >
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FilterInputs',
    inject: ['global'],
    props: {
        filter: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    computed: {
        minNumber() {
            if (this.$props.filter.field.includes('_percentage')) {
                return 0;
            }
            return null;
        },
        maxNumber() {
            if (this.$props.filter.field.includes('_percentage')) {
                return 100;
            }
            return null;
        },
    },
    mounted() {
        // force default select after mount for field selector due to Vue weirdness
        this.$refs['default-option'].setAttribute('selected', true);
    },
};
</script>
