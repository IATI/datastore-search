<template>
  <div class="flex flex-col h-full">
    <SearchBar />
    <Results />
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import ActivityResult from '../components/ActivityResult.vue'

export default {
  name: 'Activity',
  components: {
    SearchBar,
    ActivityResult,
  }
}
</script>