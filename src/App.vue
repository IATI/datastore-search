
<template>
  <div class="flex flex-col h-screen">
    <div class="bg-red-500">
      <div id="nav">
        <router-link to="/">Landing</router-link> |
        <router-link to="/Simple">Simple</router-link> |
        <router-link to="/Advanced">Advanced</router-link>
      </div>
    </div>
    <div class="bg-green-500 flex-grow"><router-view /></div>  
    <div class="bg-blue-500">footer</div>
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
