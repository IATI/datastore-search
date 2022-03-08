import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueGtag from "vue-gtag";
import "./index.css";

createApp(App)
  .use(VueGtag, {
    config: {
      id: import.meta.env.VUE_ENV_GA_ID,
      params: {
        anonymize_ip: true,
      },
    },
  })
  .use(router)
  .mount("#app");
