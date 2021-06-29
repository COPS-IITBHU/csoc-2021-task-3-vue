import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware((context) => {
    /***
     * @todo Redirect the user to login page if token is not present in store.
     * @todo Redirect the user to main page if token is present in store
     * @hints check what propeties context has
     */
    console.log("run");
    if (!context.store.getters.auth) {
        context.redirect('/login/');
    }
})