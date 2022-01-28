<script setup>
  import { useRoute } from 'vue-router';
</script>

<template>
    {{ xml }}
</template>
<script>
import global from '../global.js';

export default {
    name: 'SitemapSingle',
    data: function() {
      return {
        xml: null
      }
    },
    methods: {
        requestData: function() {
            const route = useRoute();
            const index = parseInt(route.params.index);
            global.getSingleSitemap(index).then((sitemapString) => {
                this.xml = sitemapString;
            })
        }
    },  
    created() {
        this.requestData();
    },
}
</script>
