<script setup>
  import Datepicker from 'vue3-datepicker'
  import { TrashIcon } from '@heroicons/vue/solid'
  import { QuestionMarkCircleIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  const picked = ref(new Date())
</script>

<template>
    <div class="grid grid-cols-7 gap-4">
      <div class="col-span-3">
        <select @change="global.changeFilter(filter.id, 'field', $event.target.value);" class="h-10 float-left shadow bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
          <option disabled value="" selected>Select field</option>
          <option :selected="global.isFieldOptionSelected(filter.id, filterOption.label)" v-for="filterOption in global.state.fieldOptions" :key="filterOption.field">{{ filterOption.label }}</option>
        </select>
      </div>

      <div class="col-span-3">
        <!-- Text inputs -->
        <input class="h-10 float-left shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" v-if="global.fieldType(filter.field) === 'text'" placeholder="Solr search term" v-on:change="global.changeFilter(filter.id, 'value', $event.target.value)">
        <!-- Select inputs -->
        <select class="h-10 float-left shadow bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" v-if="global.fieldType(filter.field) === 'select'" @change="global.changeFilter(filter.id, 'value', $event.target.value)">
          <option>Fake One</option>
          <option>Fake Two</option>
          <option>Fake Three</option>
        </select>
        <!-- Date inputs -->
        <div class="grid grid-cols-8 gap-2" v-if="global.fieldType(filter.field) === 'date'">
          <div class="col-span-2">
            <select class="h-10 float-left shadow bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline">
              <option>After</option>
              <option>Before</option>
            </select>
          </div>
          <div class="col-span-6">
            <datepicker v-model="picked" class="h-10 float-left shadow bg-white border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"/>
          </div>
        </div>
      
      </div>
      <div class="col-span-1">
        <div class="grid grid-cols-2 gap-1">
        <button class="float-left" v-on:click="global.removeFilter(filter.id)"><TrashIcon class="h-10 w-10 text-grey-300"/></button>
        <button class="float-left has-tooltip"><QuestionMarkCircleIcon class="h-10 w-10 text-grey-300 mx-1"/><span class='tooltip ml-9 -mt-8'>{{ filter.desc }}</span></button>
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