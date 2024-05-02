import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  resolve : {
    alias : {
      '~' : '/src'
    }
  },
  server : {
    port : 3000,
    watch : {
      usePolling : true
    },
    open : true
  }
})
