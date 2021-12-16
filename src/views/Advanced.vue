<template>
  <h1>Advanced View</h1>
  <SearchBar />
  <SideBar />
  <Results />
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import SideBar from '../components/SideBar.vue'
import Results from '../components/Results.vue'

export default {
  name: 'Landing',
  components: {
    SearchBar,
    SideBar,
    Results
  }
}
</script>