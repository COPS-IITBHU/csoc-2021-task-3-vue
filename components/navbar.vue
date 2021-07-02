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
      <div v-if="auth" class="inline-block relative">
        <div class="group relative dropdown px-4 cursor-pointer font-bold text-base tracking-wide">
          <button
            style="margin-right: 1vw;"
            type="button"
            class="
              bg-transparent
              text-white
              hover:bg-gray-200 hover:text-black
              border-4 border-white
              hover:border-transparent
              rounded-2xl
              px-2
              py-2
            "
          >
            <span id="profile-name" class="todo-profile-name flex items-center">
              {{ name }}
              <img :src="'https://ui-avatars.com/api/?name=' + this.name + '&background=random&size=35&rounded=true&bold=true&font-size=0.6'" class="ml-2">
            </span>
          </button>

          <div class="group-hover:block dropdown-menu absolute hidden h-auto">
            <ul @click="logout" class="top-0 w-48 bg-gray-100 shadow px-4 py-2 hover:bg-gray-200">
              <li class="py-1"><a @click="logout" class="block text-purple-500 font-bold text-base uppercase hover:text-purple-700 cursor-pointer">Logout</a></li>
            </ul>
          </div>
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
    }
  },
  computed: {
    auth() {
      return this.$store.getters.auth
    },
  },
  mounted() {
    if(this.auth) {
      this.getName()
    }
  },
  updated() {
    if(this.auth) {
      this.getName()
    }
  },
  methods: {
    logout() {
      this.$store.commit('setToken', null)
      this.$router.push('/login/')
      this.$router.go()
    },

    async getName() {
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }

      await this.$axios
        .get('auth/profile/', { headers })
        .then((data) => {
          this.name = data.data.name
        })
        .catch(() => {
          this.$toast.error('Some error occurred due to which your name and icon might not match :(')
        })
    },
  },
})
</script>
