<template>
  <h1 class="text-3xl pt-5">Not Found</h1>
  <p class="text-lg p-4">
    Oops, we couldn't find that page. Try going
    <router-link class="hover:underline" to="/">Home</router-link>
  </p>
</template>

<script>
export default {
  name: "NotFound",
};
</script>
