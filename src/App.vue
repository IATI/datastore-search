<script setup>
  import IatiLogo from './components/IatiLogo.vue'
</script>

<template>
  <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
    <header aria-label="Main header">
      <div class="bg-iati-grey text-white">
        <div class="mx-5 py-2">
          <div class="inline-block h-12 my-2 align-middle w-full sm:w-1/2 md:w-1/3">
          <a href="https://iatistandard.org" title="IATI Standard Website"><IatiLogo colour="#fff" class="h-12 mx-auto" /></a>
          </div>
          <div class="inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3">
            <h1 class="text-3xl">
              <a href="/"><b>Datastore Search</b><span style="color:green"> beta </span></a>
            </h1>
          </div>
          <div class="hidden md:inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3">
            <nav aria-label="Navigation" class="ml-10">
              <router-link v-if="$route.path === '/advanced' && !global.state.responseDocs" to="/" class="hover:underline">Switch to Simple Search</router-link>
              <router-link v-if="$route.path === '/advanced' && global.state.responseDocs" to="/simple" class="hover:underline">Switch to Simple Search</router-link>
              <router-link v-if="$route.path !== '/advanced'" to="/advanced" class="hover:underline">Switch to Advanced Search</router-link>
            </nav>
          </div>
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

