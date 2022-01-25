<script setup>
  import { PlusCircleIcon } from '@heroicons/vue/solid'
  import { ArrowDownIcon } from '@heroicons/vue/solid'
  import { ArrowUpIcon } from '@heroicons/vue/solid'
  import { PlayIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  import axios from 'axios'
  import { useRoute } from 'vue-router';
  import "@hennge/vue3-pagination/dist/vue3-pagination.css"
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-grow"><router-view />
        <div v-if="this.activity != null" class="grid grid-cols-10 gap-4 text-left mb-5">
          <div class="col-span-1"></div>
              <div class="col-span-8 mt-10 text-2xl border-b pb-3">{{ activity.title_narrative[0] }}</div>
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
            <div class="col-span-4 border-b pb-3">Publisher: <b>{{ activity.reporting_org_narrative[0] }}</b></div>
            <div class="col-span-4 border-b pb-3">Last updated: <b>{{ activity.last_updated_datetime }}</b></div>
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
            <div class="col-span-8 border-b pb-3">{{ activity.description_narrative[0] }}</div>
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
            <div class="col-span-8 border-b pb-3">Participating organisations: <b>{{ activity.participating_org_narrative}}</b></div>
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
            <div class="col-span-2 border-b"><b>Download this IATI Activity in full:</b></div>
            <div class="col-span-7 border-b pb-3">
              <div id="result-download-buttons">                  
                <button v-on:click="global.downloadXML()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-1 rounded float-left ml-8 w-2/24 pr-2"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">XML</span></button>
                <button v-on:click="global.downloadJSON()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">JSON</span></button>
                <button v-on:click="global.downloadJSON()" class="bg-iati-blue hover:bg-iati-grey text-white font-bold py-1 px-2 rounded ml-4 float-left w-3/24"><ArrowDownIcon class="h-5 w-5 text-grey-300 mr-1 float-left"/><span class="float-left">CSV</span></button>
              </div> 
            </div>
          <div class="col-span-1"></div>            
        </div>   
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
export default {
  name: 'ActivityResult',
  inject: ["global"],
  data: function() {
      return {
        activity: null
      }
    }, 
  mounted() {
      const axiosConfig = {
        headers: {
          'Ocp-Apim-Subscription-Key': 'fbaac107c5754bd1a5d67448bc52ce47',
        }
    }
    const route = useRoute();
    const id = route.params.iati_identifier;
    const baseUrl = 'https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative, description_narrative, participating_org_narrative, iati_identifier,last_updated_datetime,reporting_org_narrative&rows=1&q='
    
    axios.get(baseUrl + 'iati_identifier:' + id, axiosConfig).then((res) => {
      this.activity = res.data.response.docs[0]

      console.log(this.activity)
    });    
  }
}
</script>
