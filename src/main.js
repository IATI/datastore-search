import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGtag from "vue-gtag"
import './index.css'

createApp(App).use(VueGtag, {
    config: {
      id: "UA-110230511-10", // Placeholder, TODO: Replace with UA when live
      params: {
        anonymize_ip: true
      }
    }
  }).use(router).mount('#app')
