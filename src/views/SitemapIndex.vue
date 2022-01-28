<template>
    {{ xml }}
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
                this.xml = sitemapIndexString;
            })
        }
    },  
    created() {
        this.requestData();
    },
}
</script>
