<script setup>
import { PlusCircleIcon } from "@heroicons/vue/solid";
import { ArrowDownIcon } from "@heroicons/vue/solid";
import { ArrowUpIcon } from "@heroicons/vue/solid";
import { PlayIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div class="h-auto">
    <ul id="filters" class="mx-5 my-5">
      <li v-for="filter in global.state.filters" :key="filter.id">
        <FilterInputs :filter="filter" />
      </li>
    </ul>
    <div id="buttons">
      <div
        v-if="global.state.filters.length > 0"
        class="border-solid border-t border-b py-5"
      >
        <button
          aria-label="Run search query with selected filters"
          class="bg-btn-green hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-right ml-5 mr-8 pr-2 w-2/24"
          data-cabin-event="Run advanced query"
          @click="global.run()"
        >
          <PlayIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Run</span
          >
        </button>
        <button
          aria-label="Export filters to file"
          class="bg-btn-red hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-5 w-3/24"
          @click="global.toggleExportModal()"
        >
          <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Export</span
          >
        </button>
        <button
          aria-label="Import filters from file"
          class="bg-btn-red hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-5 w-3/24"
          @click="global.toggleImportModal()"
        >
          <ArrowUpIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Import</span
          >
        </button>
        <button
          aria-label="Add an additional filter"
          class="bg-btn-yellow hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"
          @click="global.addFilter()"
        >
          <PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Add</span
          >
        </button>
      </div>
      <div v-if="global.state.filters.length === 0">
        <button
          aria-label="Add an additional filter"
          class="bg-btn-yellow hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"
          @click="global.addFilter()"
        >
          <PlusCircleIcon class="h-5 w-5 text-grey-300 mr-1 float-left" /><span
            class="float-left"
            >Add Filter</span
          >
        </button>
        <button
          aria-label="Import filters from file"
          class="bg-btn-red hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"
          @click="global.toggleImportModal()"
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
import FilterInputs from "./FilterInputs.vue";
import ExportModal from "./ExportModal.vue";
import ImportModal from "./ImportModal.vue";
export default {
  name: "SideBar",
  components: {
    FilterInputs,
    ExportModal,
    ImportModal,
  },
  inject: ["global"],
};
</script>
