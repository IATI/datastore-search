<script setup>
  import { PlusCircleIcon } from '@heroicons/vue/solid'
  import { ArrowUpIcon } from '@heroicons/vue/solid'
  import { PlayIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  import VPagination from "@hennge/vue3-pagination"
  import "@hennge/vue3-pagination/dist/vue3-pagination.css"
</script>

<template>
  <div class="flex flex-col h-full">
    <DownloadButtons v-if="global.state.responseDocs" />
    <div class="flex-grow"><router-view />
          <ul id="results" class="mx-5 my-5">
          <li v-for="doc in global.state.responseDocs" :key="doc.iati_identifier">
            <Result :doc="doc" />
          </li>
        </ul>
    </div>  
    <div class="border-solid border-t grid grid-cols-3 gap-4 content-between">

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
import Result from './Result.vue';
import DownloadButtons from './DownloadButtons.vue';
export default {
  name: 'Results',
  inject: ["global"],
  components: {
      DownloadButtons,
      Result,
      VPagination,
  },
}
</script>
