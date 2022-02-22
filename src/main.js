import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueGtag from "vue-gtag"
import './index.css'

createApp(App).use(VueGtag, {
    config: {
      id: "G-YYYXLYKJML", // Placeholder, TODO: Replace with UA when live
      params: {
        anonymize_ip: true
      }
    }
  }).use(router).mount('#app')
