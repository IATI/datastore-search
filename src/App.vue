<script setup>
  import IatiLogo from './components/IatiLogo.vue'
</script>

<template>
  <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
    <header aria-label="Main header">
      <div class="bg-iati-grey text-white">
        <div class="mx-5 py-2 columns-1 sm:columns-2 md:columns-3">
          <a href="https://iatistandard.org" title="IATI Standard Website"><IatiLogo colour="#fff" class="h-12 mx-auto" /></a>
          <h1 class="text-3xl pt-7">
            <a href="/"><b>Datastore Search</b></a><span style="color:green"> beta </span>
          </h1>
          <nav aria-label="Navigation" class="pt-6 ml-10 hidden md:block">
            <router-link v-if="$route.path === '/advanced' && !global.state.responseDocs" to="/" class="hover:underline">Switch to Simple Search</router-link>
            <router-link v-if="$route.path === '/advanced' && global.state.responseDocs" to="/simple" class="hover:underline">Switch to Simple Search</router-link>
            <router-link v-if="$route.path !== '/advanced'" to="/advanced" class="hover:underline">Switch to Advanced Search</router-link>
          </nav>
        </div>
      </div>
    </header>
    <div class="flex-grow"><router-view /></div>  
    <footer class="py-2 bg-iati-grey text-white"><span>IATI Datastore Search</span></footer>
  </div>
</template>


<style>
</style>

<script>
import global from './global'

export default {
  provide: {global}
}
</script>

