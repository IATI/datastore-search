<template>
<div class="font-sans text-black min-h-screen bg-white flex items-center justify-center">
  <div class="border border-gray-400 rounded overflow-hidden flex">
    <input type="text" class="px-4 py-2" placeholder="Search...">
    <button class="flex items-center justify-center px-4 border-l">
      <svg class="h-4 w-4 text-grey-dark" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/></svg>
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
