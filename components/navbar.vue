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
        <div class="group inline-block relative">
          <button
          
            @click="logout(); swap2()"
            @mouseover="swap1"
            @mouseleave="swap2"
            class="
              rounded-full
              bg-gray-200
              py-2
              px-4
              block
              whitespace-no-wrap
              hover:bg-gray-400
            "
            href="#"
          >
            <div  class="flex w-25 h-10 font-semibold items-center text-15px" :class="class1">
              <img class="w-7 rounded-full mr-1" :src='url'/>
              {{username}}
            </div>
            <button class="font-semibold background-white w-25 h-10" :class="class2">
              logout
            </button>
          </button>
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
      name: '',
      class1: '',
      class2: 'hideme',
    }
  },
  computed: {
    auth() {
      return this.$store.getters.auth
    },
    username: function(){
      return this.$store.getters.name
    },
    url: function() {
      return 'https://ui-avatars.com/api/?name='+this.$store.getters.name+'&background=0D8ABC&color=fff'
    }
  },
  methods: {
    logout() {
      this.$store.commit('setToken', null)
      this.$router.push('/login')
      this.$cookies.remove('token')
      this.$toast.info("SEE YOU SOON!!..")
    },
    swap1(){
      this.class1='hideme'
      this.class2=''
    },
    swap2(){
      this.class1=''
      this.class2='hideme'
    }
  },
})
</script>
