<script setup>
  import { ArrowUpIcon } from '@heroicons/vue/solid'
</script>

<template>
  <div v-if="global.state.import.showModal" role="dialog" class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
            <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
                <h2 class="text-2xl">Import Filters</h2>
                <div class="mt-1">
                    <p class="my-4 text-left text-md">Import filters from file?</p>
                    <p class="my-4 text-left text-sm">Select a .json file previously exported from the Datastore Advanced Search.</p>
                    <div class="flex justify-between items-center">
                        <label for="filename" hidden>File:</label>
                        <input id="filename" class="border rounded py-2 px-3 m-2 mb-4 text-gray-700 focus:outline-none focus:shadow-outline" type="file" accept=".json" @change="global.onFilePicked">
                    </div>
                        <p v-if="global.state.import.errors.length" class="text-sm text-red-800 mb-4">
                          <ul>
                            <li v-for="error in global.state.import.errors" :key="error">{{ error }}</li>
                          </ul>
                        </p>
                    <div class="flex justify-between">
                        <button class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded" @click="global.toggleImportModal()">Cancel</button>
                        <button :disabled="global.state.import.disabled" :class="{ 'opacity-25 cursor-not-allowed': global.state.import.disabled }" class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded flex justify-between" @click="global.importFilters()">
                            <ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1"/>  
                            <span v-if="!global.state.import.fileLoading">Import</span>
                            <div
v-if="global.state.import.fileLoading" style="border-top-color:transparent"
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
