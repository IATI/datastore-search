<template>
  <div class="flex flex-col h-full min-w-fit sm:min-w-0">
    <div class="sm:grid sm:grid-cols-10 lg:grid-cols-11 sm:gap-4 text-left border-b">
      <div class="col-span-1 hidden lg:block"></div>
      <div class="m-auto col-span-4 lg:col-span-3 pl-2 lg:pl-0">
        <SearchBar />
      </div>
      <div v-if="global.state.responseTotal > 0" class="flex col-span-3 justify-center items-center">
        <DownloadButtons :iati_identifier="null" />
      </div>
      <div v-if="global.state.responseTotal > 0" class="flex col-span-2 justify-center items-center"><span class="my-2">Found {{ global.state.responseTotal }} IATI  Activities</span></div>
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