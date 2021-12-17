<template>
<div class="flex h-5/6">
  <div class="m-auto">
  <SearchBar />
  </div>  
</div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'

export default {
  name: 'Landing',
  components: {
    SearchBar
  }
}
</script>