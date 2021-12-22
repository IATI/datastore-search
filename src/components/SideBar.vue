<template>
<div class="bg-yellow-500 h-full">
  <ul id="filters">
  <li v-for="filter in global.state.filters" :key="filter.field">
    <!--NEXT make the filter register input type as well as field -->
    <select @change="global.changeFilter(filter.id, 'field', $event.target.value);">
      <option disabled value="">Please select a field</option>
      <option :selected="global.isFieldOptionSelected(filter.id, filterOption.label)" v-for="filterOption in global.state.fieldOptions" :key="filterOption.field">{{ filterOption.label }}</option>
    </select>
    <input v-if="global.fieldType(filter.field) === 'text'" placeholder="Solr search term" v-on:change="global.changeFilter(filter.id, 'value', $event.target.value)">
    <button v-on:click="global.removeFilter(filter.id)">Delete</button>
  </li>
</ul>
<button v-on:click="global.addFilter()">Add Filter</button>
</div>
</template>

<script>
  export default {
    name: 'SideBar',
    inject: ["global"],   
  }
</script>
