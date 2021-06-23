<template>
  <main class="max-w-lg mx-auto items-center justify-center px-2">
    <div class="bg-white px-6 py-8 rounded shadow-md text-black w-full">
      <h1 class="mb-8 text-3xl text-center">Register</h1>
      <label for="inputFirstName">
        <input
          id="inputFirstName"
          v-model="firstName"
          type="text"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputFirstName"
          placeholder="First Name"
        />
      </label>
      <label for="inputLastName">
        <input
          id="inputLastName"
          v-model="lastName"
          type="text"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputLastName"
          placeholder="Last Name"
        />
      </label>

      <label for="inputEmail">
        <input
          id="inputEmail"
          v-model="email"
          type="email"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputEmail"
          placeholder="Email Address"
        />
      </label>

      <label for="inputUsername">
        <input
          id="inputUsername"
          v-model="username"
          type="text"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputUsername"
          placeholder="Username"
        />
      </label>

      <label for="inputPassword">
        <input
          id="inputPassword"
          v-model="password"
          type="password"
          class="block border border-grey-light w-full p-3 rounded mb-4"
          name="inputPassword"
          placeholder="Password"
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
          hover:text-white hover:bg-green-500
          border border-green-500
          hover:border-transparent
          focus:outline-none
          my-1
        "
        @click="register"
      >
        Register
      </button>
    </div>
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const state = reactive({
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
    })

    const { redirect, $axios, store, $toast } = useContext()

    const validateField = () => {
      if (
        state.firstName === '' ||
        state.lastName === '' ||
        state.email === '' ||
        state.username === '' ||
        state.password === ''
      ) {
        $toast.error('Please fill all the fields correctly.')
        return false
      }
      if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(state.email)) {
        $toast.error('Please enter a valid email address.')
        return false
      }
      return true
    }

    function register() {
      if (!validateField()) return

      let namestr = state.firstName + " " + state.lastName;

      // `${state.firstName} ${state.lastName}`

      const dataf = {
        name: namestr,
        email: state.email,
        username: state.username,
        password: state.password,
      }

      console.log(dataf);

      $toast.info('Please wait...')


     $axios({
            url: 'https://todo-app-csoc.herokuapp.com/' + 'auth/register/',
            method: 'post',
            data: dataf,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          $toast.error('something went wrong');
        })



      // $axios
      //   .$post('auth/register', dataf)
      //   .then(({ data }) => {
      //     store.commit('setToken', data.token)
      //     redirect('/')
      //   })
      //   .catch((err) => {
      //     $toast.error(
      //       'An account using same email or username is already created'
      //     )
      //     console.log(err);
      //   })
    }

    return {
      ...toRefs(state),
      register,
    }
  },
})
</script>
