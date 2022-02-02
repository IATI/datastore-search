<script setup>
  import { ArrowUpIcon } from '@heroicons/vue/solid'
</script>

<template>
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
</template>

<script>
export default {
    name: 'ImportModal',
    inject: ["global"],
}
</script>
