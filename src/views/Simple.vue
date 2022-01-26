<template>
  <div class="flex flex-col h-full">
    <SearchBar />
    <Results />
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import Results from '../components/Results.vue'

export default {
  name: 'Simple',
  components: {
    SearchBar,
    Results,
  },
  beforeUnmount() {
    sessionStorage.removeItem('searchterm');
  }
}
</script>