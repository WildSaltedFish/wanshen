/*
 * @Author: bc_ax 1542650614@qq.com
 * @Date: 2025-04-15 18:45:38
 * @LastEditors: bc_ax 1542650614@qq.com
 * @LastEditTime: 2025-04-16 18:27:38
 * @FilePath: \aidemo\vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001", // 目标接口的域名
        changeOrigin: true, // 是否改变源地址
        rewrite: (path) => path.replace(/^\/api/, ""), // 路径重写
        
      },
    },
  },
});
