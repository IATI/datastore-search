import { createWebHistory, createRouter } from "vue-router";
import Landing from "../views/Landing.vue";
import Simple from "../views/Simple.vue";
import Advanced from "../views/Advanced.vue";

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;