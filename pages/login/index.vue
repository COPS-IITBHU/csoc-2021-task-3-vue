<template>
  <main class="max-w-lg mx-auto items-center justify-center px-2">
    <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
      <h1 class="mb-8 text-3xl text-center">Login</h1>
      <label for="inputUsername">
        <input
          id="inputUsername"
          type="text"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputUsername"
          placeholder="Username"
          v-model="info.username"
        />
      </label>

      <label for="password">
        <input
          id="inputPassword"
          type="password"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputPassword"
          placeholder="Password"
          v-model="info.password"
        />
      </label>

      <button
        type="submit"
        class="
          w-full
          text-center
          py-3
          rounded
          bg-transparent
          text-green-500
          hover:text-white
          hover:bg-green-500
          border border-green-500
          hover:border-transparent
          focus:outline-none
          my-1
        "
        @click="login()"
      >
        Login
      </button>
    </div>
  </main>
</template>

<script>
import {
  defineComponent,
  useContext,
  ref,
  useRouter,
} from '@nuxtjs/composition-api'
export default defineComponent({
  setup() {
    const { $axios, store, $toast } = useContext()
    const router = useRouter()

    const info = ref({
      username: '',
      password: '',
    })

    function validateInput() {
      if (info.value.username === '' || info.value.password === '') {
        $toast.error('Please fill all the fields correctly.')
        return false
      }
      return true
    }

    function login() {
      if (!validateInput()) return

      $toast.info('Please wait...')

      $axios
        .$post('auth/login/', {
          username: info.value.username,
          password: info.value.password,
        })
        .then((response) => {
          store.commit('setToken', response.token)
          this.$cookies.set('token',response.token)
          router.push('/')
        })
        .catch((err) => {
          $toast.error('Invalid credentians!..please give valid ones.')
        })
    }

    return {
      login,
      info,
    }
  },
})
</script>
