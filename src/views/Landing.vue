<template>
<div class="flex h-5/6">
  <div class="m-auto">
  <SearchBar />
  <router-link to="/advanced" class="bg-slate-100  hover:bg-slate-300 text-slate-600 py-2 px-4 rounded">Switch to Advanced Search</router-link>
  </div>
</div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import { pageview } from 'vue-gtag';

export default {
  name: 'Landing',
  beforeMount() {
    sessionStorage.removeItem('searchterm');
  },
  mounted(){
    pageview({
      page_path: this.$route.fullPath,
      page_title: this.$route.name
    })
  },
  components: {
    SearchBar
  }
}
</script>