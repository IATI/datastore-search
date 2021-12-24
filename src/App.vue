
<template>
  <div class="flex flex-col h-screen">
    <div class="border-solid border-b">
      <div id="nav">
        <div class="float-left mx-5"><b>IATI Datastore Search</b><span style="color:red"> alpha </span>
                <router-link to="/"> Landing</router-link> |
        <router-link to="/Simple">Simple</router-link> |
        <router-link to="/Advanced">Advanced</router-link>
        </div>

      </div>
    </div>
    <div class="flex-grow"><router-view /></div>  
    <div class="border-solid border-t">footer</div>
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

