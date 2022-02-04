<script setup>
  import IatiLogo from './components/IatiLogo.vue'
  import { useMeta } from 'vue-meta'
</script>

<template>
  <metainfo>
    <template v-slot:title="{ content }">{{ content ? `${content} - IATI Datastore Search` : `IATI Datastore Search` }}</template>
    <template v-slot:description="{ content }">{{ content }}</template>
  </metainfo>
  <div class="flex flex-col h-screen">
    <header aria-label="Main header" class="border-solid border-b back">
      <div class="bg-iati-grey text-white">
        <div class="mx-5 py-2 columns-3">
          <a href="https://iatistandard.org" title="IATI Standard Website"><IatiLogo colour="#fff" class="h-12" /></a>
          <h1 class="text-3xl pt-5">
            <a href="/"><b>Datastore Search</b></a><span style="color:green"> beta </span>
          </h1>
          <nav aria-label="Navigation" class="pt-6 ml-10">
            <router-link v-if="$route.path === '/advanced' && !global.state.responseDocs" to="/" class="hover:underline">Switch to Simple Search</router-link>
            <router-link v-if="$route.path === '/advanced' && global.state.responseDocs" to="/simple" class="hover:underline">Switch to Simple Search</router-link>
            <router-link v-if="$route.path !== '/advanced'" to="/advanced" class="hover:underline">Switch to Advanced Search</router-link>
          </nav>
        </div>
      </div>
    </header>
    <div class="flex-grow"><router-view /></div>  
    <footer class="border-solid border-t py-2 bg-iati-grey text-white"><span>Copyright Development Initiatives 2022. All rights reserved</span></footer>
  </div>
</template>


<style>
</style>

<script>
import global from './global'

export default {
  provide: {global},
  created () {
    useMeta({
      title: '',
      description: '',
      htmlAttrs: { lang: 'en', amp: true }
    })
  }
}
</script>

