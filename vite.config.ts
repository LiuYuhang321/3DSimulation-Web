import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { viteMockServe } from "vite-plugin-mock";
import json5Loader from "./src/plugins/vite-json5-loader";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: "mock",
      localEnabled: true,
      prodEnabled: false,
      injectCode: `
          import { setupProdMockServer } from '@/mockProdServer';
          setupProdMockServer();
        `,
      logger: true,
    }),
    json5Loader()
  ],
  base: "./",
  build:{
    assetsDir: ""
  },
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  server: {
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    host: "0.0.0.0", // 指定服务器主机名
    port: 8080, // 指定服务器端口
    proxy: {
      // 为开发服务器配置自定义代理规则
      "/3dsimulationapi": {
        target: "http://192.168.2.96/3dsimulationapi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/3dsimulationapi/, ""),
      },
      "/kdgeocms": {
        target: "http://192.168.2.96/kdgeocms",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kdgeocms/, ""),
      },
      "/3dts": {
        target: "http://192.168.2.179/3dts",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/3dts/, ""),
      },
    }
  },
});
