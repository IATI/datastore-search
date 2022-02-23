<template>
    <h1 class="text-3xl pt-5">Not Found</h1>
    <p class="text-lg p-4">Oops, we couldn't find that page. Try going <router-link class="hover:underline" to="/">Home</router-link></p>
</template>

<script>
import { pageview } from 'vue-gtag';

export default {
    name: 'NotFound',
    mounted(){
        pageview({
            page_path: this.$route.fullPath,
            page_title: this.$route.name
        })
    }
}
</script>
