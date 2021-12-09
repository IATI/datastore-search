<template>
  <div id="nav">
    <router-link to="/">Search</router-link> |
    <router-link to="/about">About</router-link> |
    <a href="https://iativalidator.iatistandard.org">Validator</a>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: 'Nav',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
