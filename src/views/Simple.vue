<template>
  <h1>Simple View</h1>
  <SearchBar />
  <Results />
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import Results from '../components/Results.vue'

export default {
  name: 'Simple',
  components: {
    SearchBar,
    Results
  }
}
</script>