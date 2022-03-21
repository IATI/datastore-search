<template>
  <div class="flex flex-col h-full min-w-fit sm:min-w-0">
    <div
      class="md:grid md:grid-cols-10 lg:grid-cols-11 md:gap-4 text-left border-b"
    >
      <div class="col-span-1 hidden xl:block"></div>
      <div class="m-auto col-span-4 xl:col-span-3 pl-2 lg:pl-0">
        <SearchBar />
      </div>
      <div
        v-if="global.state.responseTotal > 0"
        class="flex col-span-3 justify-center items-center"
      >
        <DownloadButtons />
      </div>
      <div
        v-if="global.state.responseTotal > 0"
        class="flex col-span-2 justify-center items-center"
      >
        <span class="my-2"
          >Found {{ global.state.responseTotal }} IATI Activities</span
        >
      </div>
      <div class="col-span-2"></div>
      <div class="col-span-1 hidden xl:block"></div>
      <SortButtons
        v-if="
          global.state.responseTotal != null && global.state.responseTotal > 0
        "
        class="pl-2 sm:pl-4 md:pl-6 lg:pl-8 md:col-span-9 lg:col-span-10"
      />
    </div>
    <ResultList />
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";
import ResultList from "../components/ResultList.vue";
import DownloadButtons from "../components/DownloadButtons.vue";
import SortButtons from "../components/SortButtons.vue";
import { pageview } from "vue-gtag";

export default {
  name: "SimpleView",
  components: {
    SearchBar,
    ResultList,
    DownloadButtons,
    SortButtons,
  },
  inject: ["global"],
  beforeUnmount() {
    sessionStorage.removeItem("searchterm");
  },
  mounted() {
    pageview({
      page_path: this.$route.fullPath,
      page_title: this.$route.name,
    });
  },
};
</script>
