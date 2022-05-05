import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd() + "/envs", ""));

  return {
    plugins: [vue()],
    envDir: "./envs",
    envPrefix: "VUE_ENV_",
    define: {
      __VUE_PROD_DEVTOOLS__: !!process.env.VUE_ENV_DEV_TOOLS,
    },
  };
});
