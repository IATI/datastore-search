<script setup>
import { QuestionMarkCircleIcon } from "@heroicons/vue/solid";
</script>

<template>
  <div v-if="showBanner" class="bg-yellow-200 flex items-center justify-center">
    <p class="p-1 text-black flex items-center">
      Planned Maintenance - Tuesday 5 April 2022 - 0900-1000 BST (London GMT+1)
      <button
        type="button"
        aria-label="Hover for more detail"
        class="has-tooltip"
      >
        <QuestionMarkCircleIcon class="h-7 w-7 text-grey-300 mx-1" /><span
          role="definition"
          class="tooltip border rounded text-white p-2 ml-9 -mt-8 bg-iati-grey"
          >During planned maintenance you may not receive search results as
          expected. Please come back later to run your queries.</span
        >
      </button>
    </p>
  </div>
</template>

<script>
export default {
  name: "NotificationBanner",
  computed: {
    showBanner() {
      return import.meta.env.VUE_ENV_SHOW_MAINTENANCE_BANNER === "true";
    },
  },
};
</script>
