import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
  path : path.resolve(__dirname, '..', '..', '.env')
})

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
