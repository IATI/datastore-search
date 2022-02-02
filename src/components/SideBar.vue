<script setup>
  import { PlusCircleIcon } from '@heroicons/vue/solid'
  import { ArrowDownIcon } from '@heroicons/vue/solid'
  import { ArrowUpIcon } from '@heroicons/vue/solid'
  import { PlayIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
</script>

<template>
<div class="h-auto">

<ul id="filters" class="mx-5 my-5">
  <li v-for="filter in global.state.filters" :key="filter.field">
    <Filter :filter="filter" />
  </li>
</ul>
<div id="buttons">
  <div v-if="global.state.filters.length > 0" class="border-solid border-t border-b py-5">
  <button v-on:click="global.run()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-right ml-5 mr-8 pr-2 w-2/24"><PlayIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">Run</span></button>
  <button v-on:click="global.toggleExportModal()" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-5 w-3/24"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">Export</span></button>
  <button v-on:click="global.toggleImportModal()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-5 w-3/24"><ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1  float-left"/><span class="float-left">Import</span></button>
  <button v-on:click="global.addFilter()" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"><PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1  float-left"/><span class="float-left">Add</span></button>
  </div>
  <div v-if="global.state.filters.length === 0" >
  <button v-on:click="global.addFilter()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"><PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1  float-left"/><span class="float-left">Add Filter</span></button>
  <button v-on:click="global.toggleImportModal()" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"><ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">Import Filters</span></button>
  </div>
  
</div>


</div>
<teleport to="#modals" >
        <div v-if="global.state.export.showModal" class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl">Export Filters</h3>
                </div>
                <div class="mt-1">
                    <p class="mb-4 mt-2 text-md">Export currently selected filters?</p>
                    <div class="flex justify-between items-center">
                        <label for="filename-in" class="px-2">File Name</label>
                        <input id="filename-in" class="border rounded py-2 px-3 m-2 mb-4 text-gray-700 focus:outline-none focus:shadow-outline" type="text" v-model="fileName" placeholder="myfilters">
                    </div>
                        <p>{{ fileName }}.json</p>
                        <p class="text-sm text-red-800 mb-4" v-if="global.state.export.errors.length">
                          <ul>
                            <li v-for="error in global.state.export.errors" :key="error">{{ error }}</li>
                          </ul>
                        </p>
                    <div class="flex justify-between">
                        <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded" v-on:click="global.toggleExportModal()">Cancel</button>
                        <button class="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-700 rounded flex justify-between" v-on:click="global.exportFilters(fileName)">
                            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1"/>  
                            <span v-if="!global.state.export.fileLoading">Export</span>
                            <div v-if="global.state.export.fileLoading" style="border-top-color:transparent"
                                class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="global.state.import.showModal" class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl">Import Filters</h3>
                </div>
                <div class="mt-1">
                    <p class="mb-4 mt-2 text-md">Import filters from file?</p>
                    <div class="flex justify-between items-center">
                        <label for="filename" class="">File:</label>
                        <input id="filename" class="border rounded py-2 px-3 m-2 mb-4 text-gray-700 focus:outline-none focus:shadow-outline" type="file" accept=".json" @change="global.onFilePicked">
                    </div>
                        <p class="text-sm text-red-800 mb-4" v-if="global.state.import.errors.length">
                          <ul>
                            <li v-for="error in global.state.import.errors" :key="error">{{ error }}</li>
                          </ul>
                        </p>
                    <div class="flex justify-between">
                        <button class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded" v-on:click="global.toggleImportModal()">Cancel</button>
                        <button :disabled="global.state.import.disabled" :class="{ 'opacity-25 cursor-not-allowed': global.state.import.disabled }" class="px-4 py-2 text-white bg-green-500 hover:bg-green-700 rounded flex justify-between" v-on:click="global.importFilters()">
                            <ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1"/>  
                            <span v-if="!global.state.import.fileLoading">Import</span>
                            <div v-if="global.state.import.fileLoading" style="border-top-color:transparent"
                                class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin">
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
  import Filter from './Filter.vue';
  export default {
    name: 'SideBar',
    inject: ["global"],
    components: {
      Filter,
    },
    data() {
    return {
      fileName: ''
    }
  }
  }
  
</script>
