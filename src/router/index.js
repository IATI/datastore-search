import { createWebHistory, createRouter } from "vue-router";
import Landing from "../views/Landing.vue";
import Simple from "../views/Simple.vue";
import Advanced from "../views/Advanced.vue";
import Activity from "../views/Activity.vue";
import log from "../middleware/sitemap.js";

const routes = [
  {
    path: "/",
    name: "landing",
    component: Landing,
    meta: {
      middleware: log
    }
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Creates a `nextMiddleware()` function which not only
// runs the default `next()` callback but also triggers
// the subsequent Middleware function.
function nextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    // If no subsequent Middleware exists,
    // the default `next()` callback is returned.
    if (!subsequentMiddleware) return context.next;
  
    return (...parameters) => {
      // Run the default Vue Router `next()` callback first.
      context.next(...parameters);
      // Then run the subsequent Middleware with a new
      // `nextMiddleware()` callback.
      const nextMiddleware = nextFactory(context, middleware, index + 1);
      subsequentMiddleware({ ...context, next: nextMiddleware });
    };
  }
  
  router.beforeEach((to, from, next) => {
    if (to.meta.middleware) {
      const middleware = Array.isArray(to.meta.middleware)
        ? to.meta.middleware
        : [to.meta.middleware];
  
      const context = {
        from,
        next,
        router,
        to,
      };
      const nextMiddleware = nextFactory(context, middleware, 1);
  
      return middleware[0]({ ...context, next: nextMiddleware });
    }
  
    return next();
  });

export default router;