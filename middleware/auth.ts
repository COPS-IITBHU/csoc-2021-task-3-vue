import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
export default defineNuxtMiddleware(({ store, redirect ,app}) => {
  if (!store.getters.token){
    redirect("/login")
  }
})