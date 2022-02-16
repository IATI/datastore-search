<template>
<div class="flex justify-left">
    <div class="flex border-2 rounded my-3">
        <input title="Search" aria-label="Search iati data" v-model="searchterm" type="text" class="px-4 py-2 placeholder-gray-600 w-auto sm:w-20 md:w-40 lg:w-50 xl:w-80" v-on:keyup.enter="global.runSimple(this.searchterm); this.$router.push('simple')" placeholder="Search IATI Activities...">
        <button role="button" aria-label="Submit" class="flex items-center justify-center px-4 border-l" @click="global.runSimple(this.searchterm); this.$router.push('simple')">
            <svg class="w-6 h-6 text-gray-600" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path
                    d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
            </svg>
        </button>
    </div>
</div>
</template>

<script>
export default {
  data: function() {
    return {
      searchterm: null
    }
  },
  watch: {
    searchterm(newValue, oldValue) {
      sessionStorage.setItem("searchterm", JSON.stringify(newValue));
    }
  },
  mounted() {
    this.searchterm = JSON.parse(sessionStorage.getItem("searchterm")) || "";
  },
  name: 'SearchBar',
  inject: ["global"]
}
</script>

