import { createWebHistory, createRouter } from "vue-router";
import Landing from "../views/Landing.vue";
import Simple from "../views/Simple.vue";
import Advanced from "../views/Advanced.vue";
import Activity from "../views/Activity.vue";
import SitemapIndex from "../views/SitemapIndex.vue";
import SitemapSingle from "../views/SitemapSingle.vue";


const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing
  },
  {
    path: "/simple",
    name: "simple",
    component: Simple
  },
  {
    path: "/advanced",
    name: "advanced",
    component: Advanced,
  },
  {
    path: "/activity/:iati_identifier",
    name: "activity",
    component: Activity,
  },
  {
    path: "/sitemap-xml-index",
    name: "sitemapIndex",
    component: SitemapIndex,
  },
  {
    path: "/sitemap-xml-:index",
    name: "sitemapSingle",
    component: SitemapSingle,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;