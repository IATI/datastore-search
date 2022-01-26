<script setup>
  import Datepicker from 'vue3-datepicker'
  import { TrashIcon } from '@heroicons/vue/solid'
  import { QuestionMarkCircleIcon } from '@heroicons/vue/solid'
  import { ChevronLeftIcon } from '@heroicons/vue/solid'
  import { ChevronRightIcon } from '@heroicons/vue/solid'
  import { ref } from 'vue'
  const picked = ref(new Date())
</script>

<template>
    <div class="grid grid-cols-10 gap-4 text-left mb-5">
        <div class="col-span-1"></div>
          <div class="col-span-4">Publisher: <b>{{ doc.reporting_org_narrative[0] }}</b></div>
          <div class="col-span-4">IATI Identifer: {{ doc.iati_identifier }}</div>
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
        <div class="col-span-8 hover:underline text-sky-700"><router-link :to="{ name: 'activity', params: { iati_identifier: doc.iati_identifier }}">{{ doc.title_narrative[0] }}</router-link><a href=""></a></div>
        <div class="col-span-1"></div>
        <div class="col-span-1"></div>
        <div class="col-span-8 border-b"><span v-html="doc.highlighting"></span></div>
        <div class="col-span-1"></div>        
    </div>    
</template>

<script>
  export default {
    props: {
      doc: Object
    },
    name: 'Result',
    inject: ["global"],
  }
</script>