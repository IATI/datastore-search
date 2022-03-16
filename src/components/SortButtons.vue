<template>
  <div class="grid grid-cols-10 gap-4 text-left my-5 inline">
    <div class="col-span-1"></div>
    <div class="inline col-span-9">
      <b>Sort by:</b>
      <button
        v-for="fieldObj in global.simpleSortFields"
        :key="fieldObj"
        :aria-label="
          fieldObj.label + ' ' + global.state.simpleSearchOrderDirection
        "
        class="bg-btn-red hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block sm:inline mb-1 sm:mb-0"
        @click="global.sortSimple(fieldObj.field)"
      >
        <span>{{ fieldObj.verbose }}</span>
        <span v-if="global.state.simpleSearchOrderField == fieldObj.field">
          <ArrowNarrowDownIcon
            v-if="global.state.simpleSearchOrderDirection == 'desc'"
            class="h-5 w-5 text-grey-300 ml-1 inline"
          />
          <ArrowNarrowUpIcon
            v-if="global.state.simpleSearchOrderDirection == 'asc'"
            class="h-5 w-5 text-grey-300 ml-1 inline"
          />
        </span>
        <span v-if="global.state.simpleSearchOrderField != fieldObj.field">
          <MinusSmIcon class="h-5 w-5 text-grey-300 ml-1 inline" />
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { ArrowNarrowDownIcon } from "@heroicons/vue/solid";
import { ArrowNarrowUpIcon } from "@heroicons/vue/solid";
import { MinusSmIcon } from "@heroicons/vue/solid";

export default {
  name: "SortButton",
  components: { ArrowNarrowDownIcon, ArrowNarrowUpIcon, MinusSmIcon },
  inject: ["global"],
};
</script>
