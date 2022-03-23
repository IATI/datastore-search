<template>
  <div class="flex flex-col h-full min-w-fit sm:min-w-0">
    <div
      class="md:grid md:grid-cols-11 lg:grid-cols-12 md:gap-4 text-left border-b"
    >
      <div class="col-span-1 hidden 2xl:block"></div>
      <div class="my-auto col-span-3 2xl:col-span-2 ml-2 2xl:ml-0">
        <SearchBar class="simple" />
      </div>
      <div
        v-if="global.state.responseTotal > 0"
        class="flex col-span-1 2xl:col-span-2 justify-center items-center"
      >
        <span class="my-2"
          >Found <b>{{ global.state.responseTotal }}</b> activities</span
        >
      </div>
      <div
        v-if="global.state.responseTotal > 0"
        class="flex col-span-3 m-1 justify-left items-center"
      >
        <SortButtons
          v-if="
            global.state.responseTotal != null && global.state.responseTotal > 0
          "
        />
      </div>
      <div
        v-if="global.state.responseTotal > 0"
        class="flex col-span-3 justify-left items-center m-1"
      >
        <DownloadButtons />
      </div>
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
