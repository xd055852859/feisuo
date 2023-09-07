import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// import autoprefixer from "autoprefixer";
// import postCssPxToRem from "postcss-pxtorem";
import AutoImport from "unplugin-auto-import/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: ["react", "react-router"],
      dts: "src/auto-import.d.ts", // 生成 `auto-import.d.ts` 全局声明
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          "@import 'src/styles/mixin/mixin.scss';@import 'src/styles/var/var.scss';",
        javascriptEnabled: true,
      },
    },
  },
  base: "./", // 设置打包路径
  server: {
    host: "0.0.0.0",
    port: 8001, // 设置服务启动端口号
    open: true, // 设置服务启动时是否自动打开浏览器
    cors: true, // 允许跨域

    // 设置代理，根据我们项目实际情况配置
  },
});
