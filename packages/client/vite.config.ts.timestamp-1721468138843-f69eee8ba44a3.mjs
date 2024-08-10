// vite.config.ts
import { defineConfig } from "file:///D:/Kuliah/Skripsi/stranough-app/node_modules/vite/dist/node/index.js";
import solid from "file:///D:/Kuliah/Skripsi/stranough-app/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import dotenv from "file:///D:/Kuliah/Skripsi/stranough-app/node_modules/dotenv/lib/main.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\Kuliah\\Skripsi\\stranough-app\\packages\\client";
dotenv.config({
  path: path.resolve(__vite_injected_original_dirname, "..", "..", ".env")
});
var vite_config_default = defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "~": "/src"
    }
  },
  server: {
    port: 3e3,
    watch: {
      usePolling: true
    },
    host: true,
    open: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxLdWxpYWhcXFxcU2tyaXBzaVxcXFxzdHJhbm91Z2gtYXBwXFxcXHBhY2thZ2VzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcS3VsaWFoXFxcXFNrcmlwc2lcXFxcc3RyYW5vdWdoLWFwcFxcXFxwYWNrYWdlc1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0t1bGlhaC9Ta3JpcHNpL3N0cmFub3VnaC1hcHAvcGFja2FnZXMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHNvbGlkIGZyb20gJ3ZpdGUtcGx1Z2luLXNvbGlkJ1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcclxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcclxuZG90ZW52LmNvbmZpZyh7XHJcbiAgcGF0aCA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicsICcuLicsICcuZW52JylcclxufSlcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3NvbGlkKCldLFxyXG4gIHJlc29sdmUgOiB7XHJcbiAgICBhbGlhcyA6IHtcclxuICAgICAgJ34nIDogJy9zcmMnXHJcbiAgICB9XHJcbiAgfSxcclxuICBzZXJ2ZXIgOiB7XHJcbiAgICBwb3J0IDogMzAwMCxcclxuICAgIHdhdGNoIDoge1xyXG4gICAgICB1c2VQb2xsaW5nIDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGhvc3QgOiB0cnVlLFxyXG4gICAgb3BlbiA6IHRydWVcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxvQkFBb0I7QUFDeFcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFIakIsSUFBTSxtQ0FBbUM7QUFJekMsT0FBTyxPQUFPO0FBQUEsRUFDWixNQUFPLEtBQUssUUFBUSxrQ0FBVyxNQUFNLE1BQU0sTUFBTTtBQUNuRCxDQUFDO0FBRUQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVU7QUFBQSxJQUNSLE9BQVE7QUFBQSxNQUNOLEtBQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUztBQUFBLElBQ1AsTUFBTztBQUFBLElBQ1AsT0FBUTtBQUFBLE1BQ04sWUFBYTtBQUFBLElBQ2Y7QUFBQSxJQUNBLE1BQU87QUFBQSxJQUNQLE1BQU87QUFBQSxFQUNUO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
