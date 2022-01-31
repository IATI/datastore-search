<template>
    <a :href="xml" ref="download" download="sitemap-index.xml">Sitemap index</a>
</template>
<script>
import global from '../global.js';

export default {
    name: 'SitemapIndex',
    layout: 'empty',
    data: function() {
      return {
        xml: null
      }
    },
    methods: {
        requestData: function() {
            global.getSitemapIndex().then((sitemapIndexString) => {
                this.xml = "data:application/xml;charset=utf-8," + escape(sitemapIndexString);
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
