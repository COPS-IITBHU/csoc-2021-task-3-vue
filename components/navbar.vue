<template>
  <nav class="bg-blue-600">
    <ul class="flex p-5 items-center justify-between">
      <transition>
        <ul v-if="auth" class="flex space-x-4 items-center justify-between">
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
      <div v-if="auth" class="w-28 inline-block relative">
          
          
        <div :class="['dropdown block']">
          <button
            :class="['rounded-b  py-2 px-4 w-auto h-auto -mx-12 font-semibold whitespace-no-wrap hover:bg-gray-900 rounded  items-center']
            "
          >
          <ul>
          <li>
            <img :src="'https://ui-avatars.com/api/?name=' + name + '&background=random&size=32&color=fff&rounded=true&uppercase=true&bold=true'" 
            class="rounded-circle -mt-1" 
            >
            <div class="todo-profile-name -mt-7.3 ml-10 text-white" id="profile-name" >{{name}}</div>
          </li> 
</ul>
          </button>
            <ul :class="['dropdown-menu absolute hidden text-gray-700 pt-1']">
            <li class="">
              <button
                :class="['bg-green-200 py-2 px-4 text-dark-400 block whitespace-no-wrap hover:bg-green-400 pr-5']
                "
                tabindex="-1"
                id="menu-item-1"
                data-toggle="dropdown"
                href="#"
                @click="logout"
              >
                Logout
              </button>
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
  data() {
  return {
    name: '',
    email: '',
    username: ''
    
  }
},

mounted() {
 this.getInitials();
},
updated() {
    if(this.auth) {
      this.getInitials();
    }
  },
  computed: {
    auth() {
      return this.$store.getters.auth
    },
  },
  methods: {
    logout() {
      this.$store.commit('setToken', null)
      this.$router.push('/login/')
    },

    getInitials() {
      let init;
      const headers = {
        Authorization : 'Token ' + this.$store.getters.token
      }
      
      this.$axios
      .get('auth/profile/', { headers })
      .then(({data}) => {
 init = JSON.parse(JSON.stringify(data))
        // console.log(init)
        this.name = init.name
        this.email = init.email
        this.username = init.username
      })
        
      
     
      
    }
  },


})
</script>
<style>
.dropdown:hover .dropdown-menu {
  display: block;
}

</style>