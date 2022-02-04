<template>
  <div class="flex flex-col h-full">
    <div class="grid grid-cols-10 gap-4 text-left border-b">
      <div class="col-span-1"></div>
      <div class="col-span-3 ">
        <SearchBar />
      </div>
      <div v-if="global.state.responseTotal > 0" class="col-span-3 mt-5">
        <DownloadButtons :iati_identifier="null" />
      </div>
      <div v-if="global.state.responseTotal > 0" class="col-span-2 mt-6"><span>Found {{ global.state.responseTotal }} IATI  Activities</span></div>
    </div>
    <Results />
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import Results from '../components/Results.vue'
import DownloadButtons from '../components/DownloadButtons.vue'

export default {
  name: 'Simple',
  components: {
    SearchBar,
    Results,
    DownloadButtons,
  },
  beforeUnmount() {
    sessionStorage.removeItem('searchterm');
  },
  inject: ["global"],
}
</script>