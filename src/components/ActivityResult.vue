<script setup>
  import axios from 'axios'
  import { useRoute } from 'vue-router';
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-grow"><router-view />
        <div v-if="activity != null" class="grid grid-cols-10 gap-4 text-left mb-5">

          <div class="col-span-1"></div>
              <h1 class="col-span-8 mt-10 text-2xl border-b pb-3">{{ activity.title_narrative[0] }}</h1>
          <div class="col-span-1"></div>

          <div class="col-span-1"></div>        
            <div class="col-span-8 border-b pb-3">
              <b>Download this IATI Activity in full:</b><DownloadButtons :iati_identifier="activity.iati_identifier" />
            </div>
          <div class="col-span-1"></div>

          <div class="col-span-1"></div>
            <div class="col-span-2 border-b pb-2">Publisher: <b>{{ activity.reporting_org_narrative[0] }}</b></div>
            <div class="col-span-2 border-b pb-2">IATI Identifier <b>{{ activity.iati_identifier }}</b></div>
            <div class="col-span-2 border-b pb-2">Last updated: <b>{{ activity.last_updated_datetime }}</b></div>
          <div class="col-span-3"></div>
          
          <div class="col-span-1"></div>
            <p class="col-span-8 border-b pb-3">{{ activity.description_narrative[0] }}</p>
          <div class="col-span-1"></div>
          <div class="col-span-1"></div>
            <div class="col-span-8 border-b pb-3">Participating organisations: <b>{{ activity.participating_org_narrative}}</b></div>
          <div class="col-span-1"></div>
           
        </div>   
    </div>
  </div>

</template>

<script>
import DownloadButtons from './DownloadButtons.vue';

export default {
  name: 'ActivityResult',
  inject: ["global"],
  data: function() {
      return {
        activity: null
      }
    },
  components: {
      DownloadButtons,
  },
  methods: {
      requestData: function() {
        
        const axiosConfig = {
            headers: {
              'Ocp-Apim-Subscription-Key': 'fbaac107c5754bd1a5d67448bc52ce47',
            }
        }

        const route = useRoute();
        const id = encodeURIComponent(route.params.iati_identifier);
        const baseUrl = 'https://dev-api.iatistandard.org/dss/activity/select?wt=json&sort=iati_identifier asc&fl=title_narrative, description_narrative, participating_org_narrative, iati_identifier,last_updated_datetime,reporting_org_narrative&rows=1&q='
        
        axios.get(baseUrl + 'iati_identifier:"' + id + '"', axiosConfig).then(({data}) => {
          if (data.response.numFound === 0) {
            this.$router.push({ name: 'NotFound'})
          } else {
            this.activity = data.response.docs[0];        
          }
        })           
      }
  },  
  created() {
    this.requestData();
  }
}
</script>
