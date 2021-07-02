import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
export default defineNuxtMiddleware(({ store, redirect ,app}) => {
  if (!app.$cookies.get('token')){
    redirect("/login")
  }
  else {
    store.commit('setToken', app.$cookies.get('token'))
  }
})