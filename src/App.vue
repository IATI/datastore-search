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
      <div class="flex flex-col md:flex-row justify-between py-4 px-12 xl:max-w-[75%] mx-auto">
        <div class="flex flex-col p-2">
          <a href="https://iatistandard.org">
            <IatiLogo colour="#fff" class="h-20" />
          </a>
        </div>
        <div class="flex flex-col p-2">
          <h2 class="mb-1 uppercase tracking-wide font-extrabold">Useful links</h2>
          <ul>
            <li>
              <a class="underline" href="https://iatistandard.org/en/contact/">Contact</a>
            </li>
            <li>
              <a class="underline" href="https://iatistandard.org/en/privacy-policy/">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div class="flex flex-col p-2">
          <div>
            <p>
              Part of the <b>IATI Unified Platform</b>
            </p>
            <p>
              Code licensed under the <a class="underline" href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU AGPL</a>.
            </p>
            <p>
              Documentation licensed under <a class="underline" href="https://creativecommons.org/licenses/by/4.0/">CC BY 3.0</a>.
            </p>
            <br/>
            <p>
              <a class="underline" href="https://github.com/IATI/datastore-search">Web</a> | <a class="underline" href="https://github.com/IATI/datastore-services">Services</a>
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-iati-accent mx-auto">
        <div class="py-4 px-12 xl:max-w-[75%] mx-auto">
          <p class="inline-block float-left">
            Copyright IATI 2021. All rights reserved
          </p>
          <div class="float-right">
            <a class="inline-block ml-2" href="https://twitter.com/IATI_aid">
              <TwitterLogo class="w-8 h-8" />
            </a>
            <a class="inline-block ml-2" href="https://www.youtube.com/channel/UCAVH1gcgJXElsj8ENC-bDQQ">
              <YoutubeLogo class="w-8 h-8" />
            </a>
            <a class="inline-block ml-2" href="https://www.linkedin.com/company/international-aid-transparency-initiative/">
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

