<script setup>
import { PlusCircleIcon } from "@heroicons/vue/solid";
import { ArrowDownIcon } from "@heroicons/vue/solid";
import { ArrowUpIcon } from "@heroicons/vue/solid";
import { PlayIcon } from "@heroicons/vue/solid";
import { ref } from "vue";
</script>

<template>
  <div class="h-auto">
    <ul id="filters" class="mx-5 my-5">
      <li v-for="filter in global.state.filters" :key="filter.field">
        <Filter :filter="filter" />
      </li>
    </ul>
    <div id="buttons">
      <div
        v-if="global.state.filters.length > 0"
        class="border-solid border-t border-b py-5"
      >
        <button
          v-on:click="global.run()"
          class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-right ml-5 mr-8 pr-2 w-2/24"
        >
          <PlayIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Run</span
          >
        </button>
        <button
          v-on:click="global.toggleExportModal()"
          class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-5 w-3/24"
        >
          <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Export</span
          >
        </button>
        <button
          v-on:click="global.toggleImportModal()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-5 w-3/24"
        >
          <ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Import</span
          >
        </button>
        <button
          v-on:click="global.addFilter()"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"
        >
          <PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Add</span
          >
        </button>
      </div>
      <div v-if="global.state.filters.length === 0">
        <button
          v-on:click="global.addFilter()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"
        >
          <PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Add Filter</span
          >
        </button>
        <button
          v-on:click="global.toggleImportModal()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"
        >
          <ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Import Filters</span
          >
        </button>
      </div>
    </div>
  </div>
  <teleport to="#modals">
    <ExportModal />
    <ImportModal />
  </teleport>
</template>

<script>
import Filter from "./Filter.vue";
import ExportModal from "./ExportModal.vue";
import ImportModal from "./ImportModal.vue";
export default {
  name: "SideBar",
  inject: ["global"],
  components: {
    Filter,
    ExportModal,
    ImportModal,
  },
};
</script>
