<script setup>
import { ArrowDownIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div
    v-if="global.state.export.showModal"
    class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
  >
    <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
      <div class="flex items-center justify-between">
        <h3 class="text-2xl">Export Filters</h3>
      </div>
      <div class="mt-1">
        <p class="mb-4 mt-2 text-md">Export currently selected filters?</p>
        <div class="flex justify-between">
          <button
            class="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded"
            v-on:click="global.toggleExportModal()"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 text-white bg-yellow-500 hover:bg-yellow-700 rounded flex justify-between"
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
