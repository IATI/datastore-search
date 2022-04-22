<script setup>
import IatiLogo from "./components/IatiLogo.vue";
import TwitterLogo from "./components/TwitterLogo.vue";
import LinkedInLogo from "./components/LinkedInLogo.vue";
import NotificationBanner from "./components/NotificationBanner.vue";
</script>

<template>
  <div class="flex flex-col h-screen min-w-fit sm:min-w-0">
    <header aria-label="Main header">
      <div class="bg-iati-grey text-white">
        <div class="mx-5">
          <div
            class="inline-block h-12 my-2 align-middle w-full sm:w-1/2 md:w-1/3"
          >
            <a href="https://iatistandard.org" title="IATI Standard Website"
              ><IatiLogo colour="#fff" class="h-12 mx-auto"
            /></a>
          </div>
          <div
            class="inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3"
          >
            <h1 class="text-4xl mt-5">
              <a href="/"><b>Datastore Search</b></a>
            </h1>
          </div>

          <div
            class="hidden md:inline-block h-full my-2 align-middle w-full sm:w-1/2 md:w-1/3"
          >
            <nav aria-label="Navigation" class="ml-10 mt-8 text-xl">
              <router-link
                v-if="$route.path === '/advanced'"
                to="/"
                class="hover:underline"
                >Simple Search</router-link
              >
              <router-link
                v-if="$route.path !== '/advanced' && $route.path !== '/'"
                to="/advanced"
                class="hover:underline"
                >Advanced Search</router-link
              >
              <a
                v-if="$route.path === '/'"
                class="hover:underline pl-2 ml-2"
                href="https://developer.iatistandard.org/api-details#api=datastore"
                >API</a
              >
              <a
                v-if="$route.path !== '/'"
                class="hover:underline border-l pl-2 ml-2"
                href="https://developer.iatistandard.org/api-details#api=datastore"
                >API</a
              >
              <a class="hover:underline border-l pl-2 ml-2" href="/about"
                >About</a
              >
            </nav>
          </div>
        </div>
        <NotificationBanner />
      </div>
    </header>
    <div class="flex-grow"><router-view /></div>
    <footer class="bg-iati-grey text-white text-left text-sm">
      <div class="mx-auto">
        <div class="py-4 px-12 xl:max-w-[75%] mx-auto">
          <p class="inline-block float-left mt-1">
            Datastore Search is part of the IATI Unified Platform
          </p>

          <div class="float-right">
            <p class="inline-block float-left mt-1 mr-5">
              <a
                class="hover:underline"
                role="link"
                href="https://iatistandard.org/en/privacy-policy/"
                >Privacy</a
              >
            </p>
            <p class="inline-block float-left mt-1 mr-5">
              <a
                class="hover:underline"
                role="link"
                href="https://iatistandard.org/en/contact/"
                >Contact</a
              >
            </p>
            <a
              class="inline-block ml-2"
              role="link"
              aria-label="iati twitter profile link"
              href="https://twitter.com/IATI_aid"
            >
              <TwitterLogo class="w-8 h-8" />
            </a>
            <a
              class="inline-block ml-5"
              role="link"
              aria-label="iati linkedin profile link"
              href="https://www.linkedin.com/company/international-aid-transparency-initiative/"
            >
              <LinkedInLogo class="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import global from "./global";
import { time } from "vue-gtag";

export default {
  components: {
    NotificationBanner,
  },
  provide: { global },
  mounted() {
    const timeSincePageLoad = Math.round(performance.now());
    time({
      name: "load",
      value: timeSincePageLoad,
      event_category: "Initial application load",
    });
  },
};
</script>
