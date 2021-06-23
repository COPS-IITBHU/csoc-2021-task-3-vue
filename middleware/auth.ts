import { defineNuxtMiddleware } from '@nuxtjs/composition-api'

export default defineNuxtMiddleware((context) => {
  /***
   * @todo Redirect the user to login page if token is not present in store.
   * @todo Redirect the user to main page if token is present in store
   * @hints check what propeties context has
   */

   if(localStorage.getItem("token")==null) {
     console.log("not found");
     window.location.href = "/login/";
   }

   else {
    // window.location.href = "/";
   }

  console.log("working!!!!!")
  console.log(context);
})
