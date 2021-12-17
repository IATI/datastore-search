<template>
<div class="bg-yellow-500 h-full">
  <ul id="filters">
  <li v-for="filter in global.state.filters" :key="filter.field">
    {{ filter.field }} : {{ filter.value }}
  </li>
</ul>
</div>
</template>

<script>
export default {
  name: 'SideBar',
  inject: ["global"]
}
</script>
