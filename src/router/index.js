import { createRouter, createWebHashHistory } from 'vue-router'
import search from '../views/search.vue'

const routes = [
  {
    path: '/',
    name: 'Search',
    component: search
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/about.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
