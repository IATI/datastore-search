<template>
  <div>
    <b>Sort by:</b>
    <button
      v-for="fieldObj in global.simpleSortFields"
      :key="fieldObj"
      :aria-label="
        fieldObj.label +
        ' ' +
        (global.state.simpleSearchOrderField == fieldObj.field
          ? global.state.simpleSearchOrderDirection
          : '')
      "
      class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block inline mb-1"
      @click="global.sortSimple(fieldObj.field)"
    >
      <span>{{ fieldObj.verbose }}</span>
      <span v-if="global.state.simpleSearchOrderField == fieldObj.field">
        <ChevronDownIcon
          v-if="global.state.simpleSearchOrderDirection == 'desc'"
          class="h-5 w-5 text-grey-300 ml-1 inline"
        />
        <ChevronUpIcon
          v-if="global.state.simpleSearchOrderDirection == 'asc'"
          class="h-5 w-5 text-grey-300 ml-1 inline"
        />
      </span>
      <span v-if="global.state.simpleSearchOrderField != fieldObj.field">
        <MinusSmIcon class="h-5 w-5 text-grey-300 ml-1 inline" />
      </span>
    </button>
  </div>
</template>

<script>
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { ChevronUpIcon } from "@heroicons/vue/solid";
import { MinusSmIcon } from "@heroicons/vue/solid";

export default {
  name: "SortButton",
  components: { ChevronDownIcon, ChevronUpIcon, MinusSmIcon },
  inject: ["global"],
};
</script>
