<script setup>
  import IatiLogo from './components/IatiLogo.vue'
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="border-solid border-b back">
      <div id="nav" class="bg-iati-grey text-white">
        <div class="mx-5 py-2 columns-3">
          <IatiLogo colour="#fff" class="h-12" />
          <div class="text-3xl pt-5">
            <b>Datastore Search</b><span style="color:red"> alpha </span>
          </div>
          <div class="pt-6 ml-10">
            <router-link to="/"> Landing</router-link> |
            <router-link to="/Simple">Simple</router-link> |
            <router-link to="/Advanced">Advanced</router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow"><router-view /></div>  
    <div class="border-solid border-t py-2 bg-iati-grey text-white"><span>Copyright IATI 2022. All rights reserved</span></div>
  </div>
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<script>
import global from './global'

export default {
  provide: {global}
}
</script>

