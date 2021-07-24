import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware((context) => {
  /***
   * @todo Redirect the user to login page if token is not present in store.
   * @todo Redirect the user to main page if token is present in store
   * @hints check what propeties context has
   */
  let token = context.store.getters.token
  let path = context.route.fullPath

  if(token === null && path === '/')
    context.redirect('login/')
  else if(token !== null && (path === '/register' || path === '/login'))
    context.redirect('/')
})
