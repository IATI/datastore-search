<script setup>
  import VPagination from "@hennge/vue3-pagination"
  import "@hennge/vue3-pagination/dist/vue3-pagination.css"
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-center">
      <svg v-if="global.state.responseTotal === null && global.state.query != null" role="status" class="mt-20 mr-2 w-14 h-14 text-gray-200 animate-spin dark:text-gray-600 fill-iati-grey" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </div>
    <div v-if="global.state.responseTotal > 0 && $route.matched[0].path === '/advanced'" class="grid grid-cols-4 gap-4 text-left py-3 border">
        <div class="col-span-1"></div>
        <div class="col-span-3"><div class="float-left mr-3 mt-1">Found {{ global.state.responseTotal }} matching IATI Activities</div><DownloadButtons v-if="global.state.responseDocs" :iati_identifier="null" /></div>
    </div>
    
    <div class="flex-grow"><router-view />
          <ul v-if="global.state.responseTotal != null && global.state.responseTotal > 0" id="results" class="mx-5 my-5">
          <li v-for="doc in global.state.responseDocs" :key="doc.id">
            <Result :doc="doc" />
          </li>
        </ul>
        
        <p v-if="global.state.responseTotal === 0" class="mt-10">No matching IATI Activities - please try a different search</p>
    </div>
    <div class="border-solid border-t p-2 flex">
    <v-pagination
          class="flex flex-auto justify-center"
          v-model="page"
          :pages="global.state.numberPages"
          :range-size="global.state.resultsPerPage"
          active-color="#155366"
          @update:modelValue="global.paginationUpdate(page)"
        />
    </div>        
  </div>
</template>

<style>
/* override the pagination component CSS */
.Control {
  position: relative;
  display: block;
  width: 25px;
  height: 25px;
  margin: 0 3px;
  fill: #0369A1; }
  .Control-active {
    fill: #0369A1;
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
  padding: 15px;
  margin: 0 3px;
  color: #0369A1;
  background-color: transparent;
  font-size: 20px;
  border: 1px solid #DEDEDE;
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
  data() {
      return {page: 1} 
    }
}
</script>
