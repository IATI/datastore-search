<template>
  <div>
    <div id="result-download-buttons">
      <b class="block 2xl:inline">Download:</b>
      <button
        v-for="format in global.state.download.formats"
        :key="format"
        class="bg-iati-grey hover:bg-iati-blue text-white font-bold py-1 px-2 rounded ml-4 w-3/24 block inline mb-1"
        @click="global.toggleDownloadModal(format)"
      >
        <ArrowDownIcon class="inline h-5 w-5 text-grey-300 mr-1" />
        <span>{{ format }}</span>
        <div></div>
      </button>
    </div>
    <teleport to="#modals">
      <div
        v-if="global.state.download.showModal"
        role="dialog"
        class="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50"
      >
        <div class="max-w-sm p-6 bg-white divide-y divide-gray-500 rounded">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl">
              Download {{ iatiIdentifier ? "Activity" : "Results" }} File
            </h2>
          </div>
          <div class="mt-1">
            <p
              v-if="global.state.download.selectedFormat != 'XML'"
              class="mb-4 mt-2 text-md"
            >
              Download
              <span v-if="iatiIdentifier"> this IATI Activity </span>
              <span v-if="!iatiIdentifier">
                {{ global.state.responseTotal }} results
              </span>
              from the
              <select
                v-model="core"
                class="h-8 bg-white border rounded focus:outline-none focus:shadow-outline"
              >
                <option value="activity" :selected="true">Activity</option>
                <option value="transaction">Transaction</option>
                <option value="budget">Budget</option>
              </select>
              core in {{ global.state.download.selectedFormat }} format?
            </p>

            <p
              v-if="global.state.download.selectedFormat === 'XML'"
              class="mb-4 mt-2 text-md"
            >
              Download

              <span v-if="iatiIdentifier"> this IATI Activity </span>
              <span v-if="!iatiIdentifier">
                {{ global.state.responseTotal }} results
              </span>
              in an IATI Activities XML document?
            </p>

            <div class="flex justify-between">
              <button
                class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded"
                @click="global.cancelDownloadFile()"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 text-white bg-iati-grey hover:bg-iati-blue rounded flex justify-between"
                @click="
                  global.downloadFile(
                    global.state.download.selectedFormat,
                    iatiIdentifier,
                    core
                  )
                "
              >
                <ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1" />
                <span v-if="!global.state.download.fileLoading">Download</span>
                <div
                  v-if="global.state.download.fileLoading"
                  style="border-top-color: transparent"
                  class="w-6 h-6 p-2 border-4 border-white border-dotted rounded-full animate-spin"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ArrowDownIcon } from "@heroicons/vue/solid";

export default {
  name: "DownloadButtons",
  components: { ArrowDownIcon },
  inject: ["global"],
  props: { iatiIdentifier: { type: String, default: null } },
  data() {
    return { core: "activity" };
  },
};
</script>
