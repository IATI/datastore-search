<script setup>
  import Datepicker from 'vue3-datepicker'
  import { TrashIcon } from '@heroicons/vue/solid'
  import { QuestionMarkCircleIcon } from '@heroicons/vue/solid'
  import { ChevronLeftIcon } from '@heroicons/vue/solid'
  import { ChevronRightIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  const picked = ref(new Date())
</script>

<template>
    <div class="grid grid-cols-7 gap-4">
      <div class="col-span-3">
        <select @change="global.changeFilter(filter.id, 'field', $event.target.value);" class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
          <option disabled value="" selected>Select field</option>
          <option :selected="global.isFieldOptionSelected(filter.id, filterOption.label)" v-for="filterOption in global.state.fieldOptions" :key="filterOption.field">{{ filterOption.label }}</option>
        </select>
      </div>

      <div class="col-span-3">
        <!-- Text inputs -->
        <input class="h-10 float-left border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" v-if="global.fieldType(filter.field) === 'text'" placeholder="Solr search term" v-on:change="global.changeFilter(filter.id, 'value', $event.target.value)">
        <!-- Select inputs -->
        <select class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" v-if="global.fieldType(filter.field) === 'select'" @change="global.changeFilter(filter.id, 'value', $event.target.value)">
          <option>Fake One</option>
          <option>Fake Two</option>
          <option>Fake Three</option>
        </select>
        <!-- Date inputs -->
        <div class="grid grid-cols-8 gap-2" v-if="global.fieldType(filter.field) === 'date'">
          <div class="col-span-3">
            <div class="flex items-center justify-center">
              <div class="inline-flex" role="toolbar">
                <button
                  :class="{'bg-blue-300': (filter.operator === 'lessThan')}"
                  @click="global.changeFilter(filter.id, 'operator', 'lessThan')"
                  type="button" 
                  class="h-10 border-l border-t border-b rounded-l px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                >
                  &#60;
                </button>
                <button
                  :class="{'bg-blue-300': (filter.operator === 'equals')}"
                  @click="global.changeFilter(filter.id, 'operator', 'equals')"
                  type="button" 
                  class="h-10 border px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                >
                  =
                </button>
                <button
                  :class="{'bg-blue-300': (filter.operator === 'greaterThan')}"
                  @click="global.changeFilter(filter.id, 'operator', 'greaterThan')"
                  type="button" 
                  class="h-10 border-r border-t border-b rounded-r px-2 py-2 text-gray-700 font-medium text-xs leading-tight uppercase hover:bg-blue-500 focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
                >
                  &#62;
                </button>
              </div>
            </div>
          </div>
          <div class="col-span-5">
            <datepicker v-model="picked" class="h-10 float-left bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"/>
          </div>
        </div>
      
      </div>
      <div class="col-span-1">
        <div class="grid grid-cols-2 gap-1">
        <button class="float-left" v-on:click="global.removeFilter(filter.id)"><TrashIcon class="h-7 w-7 text-grey-300"/></button>
        <button class="float-left has-tooltip"><QuestionMarkCircleIcon class="h-7 w-7 text-grey-300 mx-1"/><span class='tooltip ml-9 -mt-8'>{{ filter.desc }}</span></button>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    props: {
      filter: Object
    },
    name: 'Filter',
    inject: ["global"],   
  }
</script>