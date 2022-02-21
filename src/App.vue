<script setup>
  import IatiLogo from './components/IatiLogo.vue'
  import TwitterLogo from './components/TwitterLogo.vue'
  import YoutubeLogo from './components/YoutubeLogo.vue'
  import LinkedInLogo from './components/LinkedInLogo.vue'
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
    <div class="flex-grow min-h-[12rem]"><router-view /></div>  
    <footer class="bg-iati-grey text-white text-left text-sm">
      <div class="mx-auto">
        <div class="py-4 px-12 xl:max-w-[75%] mx-auto">
          <p class="inline-block float-left mt-1">
            Part of the IATI Unified Platform
          </p>
          
          <div class="float-right">
            <p class="inline-block float-left mt-1 mr-5">
            <a class="hover:underline" href="https://iatistandard.org/en/privacy-policy/">Privacy</a>
            </p>
            <p class="inline-block float-left mt-1 mr-5">
            <a class="hover:underline" href="https://iatistandard.org/en/contact/">Contact</a>
            </p>
            <a class="inline-block ml-2" href="https://twitter.com/IATI_aid">
              <TwitterLogo class="w-8 h-8" />
            </a>
            <a class="inline-block ml-5" href="https://www.linkedin.com/company/international-aid-transparency-initiative/">
            <LinkedInLogo class="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </footer>
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

