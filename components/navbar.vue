<template>
  <nav class="bg-blue-600">
    <ul class="flex p-5 items-center justify-between">
      <transition>
        <ul v-if="auth"  class="flex space-x-4 items-center justify-between">
          <li>
            <h1 class="font-bold text-white text-xl">Todo</h1>
          </li>
          <li class="font-semibold text-white">
            <nuxt-link to="/">Tasks</nuxt-link>
          </li>
        </ul>
        <ul v-else class="flex">
          <li class="text-white mr-2">
            <nuxt-link to="/login">Login</nuxt-link>
          </li>
          <li class="text-white">
            <nuxt-link to="/register">Register</nuxt-link>
          </li>
        </ul>
      </transition>
      <div v-if="auth" class="w-50 inline-block relative ml-10">
        <div class="dropdown blo relative">
          <button
            class="
              bg-gray-300
              text-gray-700
              font-semibold
              py-2
              px-3
              whitespace-no-wrap
              rounded
              inline-flex
              items-center
            "
          ><span class="text-blue-700 mr-2 bg-white p-1">{{initials}}</span>
            <span class="mr-1">{{name}}</span>
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </button>
          <ul class="dropdown-menu absolute hidden text-gray-700 pt-1">
            <li class="">
              <a
                class="
                  rounded-b
                  bg-gray-200
                  py-2
                  px-4
                  block
                  whitespace-no-wrap
                  hover:bg-gray-400
                  pr-5
                "
                tabindex="-1"
                id="menu-item-1"
                data-toggle="dropdown"
                href="#"
                @click="logout"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </ul>
  </nav>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  data(){
   
    return{
      initials:'',
      name:'',

    }
  },
  computed: {
    auth() {
       let firstName='';
    let lastName='';
    let ints='';
    const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
    this.$axios.get('auth/profile/',{headers})
    .then(({data})=>{
      firstName=data.name.split(" ")[0];
      ints+=data.name.split(" ")[0][0].toUpperCase();
      if(data.name.split(" ").length>1){
        lastName=data.name.split(" ")[1];
        ints+=data.name.split(" ")[1][0].toUpperCase();
      }
      this.initials=ints;
      this.name=firstName+" "+lastName;
    })
      return this.$store.getters.auth
    },
  },
  methods: {
    logout() {
      this.$store.commit('setToken', null)
      this.$router.replace('/login')
    },
  },
})
</script>

<style>
.dropdown:hover .dropdown-menu {
  display: block;
}
</style>