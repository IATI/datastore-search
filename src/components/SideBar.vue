<script setup>
  import Datepicker from 'vue3-datepicker'
  import { TrashIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  const picked = ref(new Date())
</script>

<template>
<div class="h-auto">

  <ul id="filters" class="mt-5 mx-5">
  <li v-for="filter in global.state.filters" :key="filter.field" class="mb-5">
    <Filter :filter="filter" />
  </li>
</ul>
<button v-on:click="global.addFilter()">Add Filter</button>
</div>
</template>

<script>
  import Filter from './Filter.vue';
  export default {
    name: 'SideBar',
    inject: ["global"],
    components: {
      Filter,
    }  
  }
  
</script>
