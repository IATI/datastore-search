<script setup>
  import { useRoute } from 'vue-router';
</script>

<template>
    <a :href="xml" ref="download" download="sitemap.xml">Sitemap</a>
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
                this.xml = "data:application/xml;charset=utf-8," + escape(sitemapString);
            })
        }
    },  
    created() {
        this.requestData();
    },
    updated() {
        this.$refs.download.click();
    }
}
</script>
