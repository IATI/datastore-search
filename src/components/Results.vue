<script setup>
  import { PlusCircleIcon } from '@heroicons/vue/solid'
  import { ArrowDownIcon } from '@heroicons/vue/solid'
  import { ArrowUpIcon } from '@heroicons/vue/solid'
  import { PlayIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  import VPagination from "@hennge/vue3-pagination";
  import "@hennge/vue3-pagination/dist/vue3-pagination.css";
</script>

<template>
  <div class="flex flex-col h-full">
    <div id="result-download-buttons" class="pt-5 float-left mx-5">    
      <button v-on:click="global.downloadXML()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1  float-left"/><span class="float-left">XML</span></button>
      <button v-on:click="global.downloadJSON()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">JSON</span></button>
      <button v-on:click="global.downloadJSON()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">CSV</span></button>    </div>
    <div class="flex-grow"><router-view />
    </div>  
    <div class="border-solid border-t grid grid-cols-3 gap-4 content-between">
        <div></div>
  <div><v-pagination
        class="content-center w-auto"
        v-model="global.state.page"
        :pages="20"
        :range-size="4"
        active-color="#81c3d6"
        @update:modelValue="global.paginationUpdate"
      />
    </div></div>
  <div></div>
      
  </div>
</template>

<style>
/* ovveride the pagination component CSS */
.Control {
  position: relative;
  display: block;
  width: 25px;
  height: 25px;
  margin: 0 2px;
  fill: #BBBBBB; }
  .Control-active {
    fill: #333333;
    cursor: pointer;
    transition: fill 0.2s ease-in-out; }
    .Control-active:hover {
      fill: #000000;
      transition: fill 0.2s ease-in-out; }

.Page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 0 2px;
  color: #666666;
  background-color: transparent;
  font-size: 20px;
  border-radius: 3px;
  box-sizing: border-box;
  border-color: transparent;
  cursor: pointer;
  outline: 0;
  user-select: none; }
  .Page:hover {
    border: 1px solid #DEDEDE; }
  .Page-active {
    color: #ffffff;
    border: 1px solid #DEDEDE; }
</style>

<script>
export default {
  name: 'Results',
  inject: ["global"],
      components: {
        VPagination
    },
}
</script>
