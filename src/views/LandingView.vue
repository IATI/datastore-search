<template>
  <div class="flex h-5/6">
    <div class="m-auto">
      <SearchBar />
      <router-link
        to="/advanced"
        class="bg-slate-100 hover:bg-slate-300 text-slate-600 py-2 px-4 rounded hide-on-mobile"
        >Switch to Advanced Search</router-link
      >
    </div>
  </div>
</template>

<script>
import SearchBar from "../components/SearchBar.vue";

export default {
  name: "LandingView",
  components: {
    SearchBar,
  },
  beforeMount() {
    sessionStorage.removeItem("searchterm");
  },
};
</script>
