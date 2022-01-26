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
  beforeMount() {
    sessionStorage.removeItem('searchterm');
  },
  components: {
    SearchBar
  }
}
</script>