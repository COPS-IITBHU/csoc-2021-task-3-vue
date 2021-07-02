<template>
  <main class="max-w-lg mx-auto items-center justify-center px-2">
    <div class="bg-white px-6 py-8 my-38 rounded shadow-md text-black w-full">
      <h1 class="mb-8 text-3xl text-center">Login</h1>
      <label for="inputUsername">
        <input
          id="inputUsername"
          v-model="inputUsername"
          type="text"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputUsername"
          placeholder="Username"
        />
      </label>

      <label for="password">
        <input
          id="inputPassword"
          v-model="inputPassword"
          type="password"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputPassword"
          placeholder="Password"
        />
      </label>

      <button
        type="submit"
        :class="[
          'w-full h-auto text-center py-3 rounded bg-transparent text-green-500 hover:text-white hover:bg-green-500 border border-green-500 hover:border-transparent focus:outline-none my-1'
        ]"
        @click="login"
      >
        Login
      </button>
    </div>
  </main>
</template>

<script>
import { useContext, reactive, toRefs } from '@nuxtjs/composition-api'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const state = reactive({
      inputUsername: '',
      inputPassword: '',
    })
    const { redirect, $axios, store, $toast } = useContext()

    const validateLogin = () => {
      if (state.inputUsername === '' || state.inputPassword === '') {
        $toast.error('Please fill all the fields correctly.')
        return false
      }
      return true
    }
    function login() {
      if (!validateLogin()) return

      const data1 = {
        username: state.inputUsername,
        password: state.inputPassword,
      }

      $toast.info('Please wait...')

      $axios
        .$post('auth/login/', data1)
        .then(({ token }) => {
          store.commit('setToken', token)
          // this.$store.getters.auth
          redirect('/')
        })
        .catch(() => {
          $toast.error('Entered username or password is incorrect')
        })
    }

    return {
      ...toRefs(state),
      login,
    }
  },
})
</script>


