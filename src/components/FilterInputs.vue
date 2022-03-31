<script setup>
import Datepicker from "vue3-datepicker";
import { TrashIcon } from "@heroicons/vue/solid";
import { QuestionMarkCircleIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div class="grid grid-cols-7 gap-4">
    <div
      v-if="!global.isFilterFirstInChain(filter.id)"
      class="inline-flex"
      role="toolbar"
    >
      <button
        :class="{ 'bg-blue-300': filter.joinOperator === 'AND' }"
        type="button"
        class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
        @click="global.changeFilter(filter.id, 'joinOperator', 'AND')"
      >
        AND
      </button>
      <button
        :class="{ 'bg-blue-300': filter.joinOperator === 'OR' }"
        type="button"
        class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
        @click="global.changeFilter(filter.id, 'joinOperator', 'OR')"
      >
        OR
      </button>
    </div>
  </div>
  <div class="grid grid-cols-7 gap-4 my-3">
    <div class="col-span-3">
      <select
        class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        @change="global.changeFilter(filter.id, 'field', $event.target.value)"
      >
        <option disabled value="" selected>Select field</option>
        <option
          v-for="filterOption in global.state.fieldOptions"
          :key="filterOption.field"
          :selected="
            global.isFieldOptionSelected(filter.id, filterOption.field)
          "
        >
          {{ filterOption.label }}
        </option>
      </select>
    </div>

    <div class="col-span-3">
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
          TRUE
        </button>
        <button
          :class="{ 'bg-blue-300': filter.value === 'false' }"
          type="button"
          class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
          @click="global.changeFilter(filter.id, 'value', 'false')"
        >
          FALSE
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
        @input="
          global.changeFilter(filter.id, 'value', Number($event.target.value))
        "
      />
      <!-- Text inputs -->
      <input
        v-if="global.isFieldType(filter.field, 'text')"
        type="text"
        :class="{ 'border-red-400': filter.valid === false }"
        class="h-10 mb-2 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
        placeholder="Search term"
        :value="filter.value"
        @input="global.changeFilter(filter.id, 'value', $event.target.value)"
      />
      <p v-if="filter.valid === false" class="text-sm text-red-600">
        {{ filter.validationMessage }}
      </p>
      <!-- Select inputs -->
      <div
        v-if="global.isFieldType(filter.field, 'select')"
        class="grid grid-cols-8 gap-2"
      >
        <div class="col-span-3">
          <div class="flex items-center justify-center">
            <div class="inline-flex" role="toolbar">
              <button
                :class="{ 'bg-blue-300': filter.operator === 'equals' }"
                type="button"
                class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="global.changeFilter(filter.id, 'operator', 'equals')"
              >
                ==
              </button>
              <button
                :class="{ 'bg-blue-300': filter.operator === 'notEquals' }"
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
            :value="filter.value"
            @change="
              global.changeFilter(filter.id, 'value', $event.target.value)
            "
          >
            <option
              disabled
              value=""
              :selected="global.dropdownStateBlank(filter.id)"
            >
              Select code
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
              <span> {{ valueOption.code }} - {{ valueOption.name }} </span>
            </option>
          </select>
        </div>
      </div>

      <!-- Date inputs -->
      <div
        v-if="global.isFieldType(filter.field, 'date')"
        class="grid grid-cols-8 gap-2"
      >
        <div class="col-span-3">
          <div class="flex items-center justify-center">
            <div class="inline-flex" role="toolbar">
              <button
                :class="{ 'bg-blue-300': filter.operator === 'lessThan' }"
                type="button"
                class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="global.changeFilter(filter.id, 'operator', 'lessThan')"
              >
                &#60;
              </button>
              <button
                :class="{ 'bg-blue-300': filter.operator === 'equals' }"
                type="button"
                class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="global.changeFilter(filter.id, 'operator', 'equals')"
              >
                =
              </button>
              <button
                :class="{ 'bg-blue-300': filter.operator === 'greaterThan' }"
                type="button"
                class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                @click="
                  global.changeFilter(filter.id, 'operator', 'greaterThan')
                "
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
            @update:model-value="
              global.changeFilter(filter.id, 'value', $event)
            "
          />
        </div>
      </div>
    </div>
    <div class="col-span-1">
      <div class="grid grid-cols-2 gap-1">
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
  name: "FilterInputs",
  inject: ["global"],
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
      if (this.$props.filter.field.includes("_percentage")) {
        return 0;
      }
      return null;
    },
    maxNumber() {
      if (this.$props.filter.field.includes("_percentage")) {
        return 100;
      }
      return null;
    },
  },
};
</script>
