<script setup>
import { ArrowDownIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div
    role="dialog"
    v-if="global.state.export.showModal"
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
        <h2 class="text-2xl">Export Filters</h2>

      <div class="mt-1">
        <p class="mb-4 mt-2 text-left text-md">Export currently selected filters to file?</p>
        <p class="mb-4 mt-2 text-left text-sm">This will allow you to import them later to run the same query or share with someone else.</p>
        <div class="flex justify-between">
          <button
            class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded"
            v-on:click="global.toggleExportModal()"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-white font-bold bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
            v-on:click="global.exportFilters()"
          >
            <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1" />
            <span v-if="!global.state.export.fileLoading">Export</span>
            <div
              v-if="global.state.export.fileLoading"
              style="border-top-color: transparent"
              class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin"
            ></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ExportModal",
  inject: ["global"],
};
</script>
