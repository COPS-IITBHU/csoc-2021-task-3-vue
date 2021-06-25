import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import createPersistedState from 'vuex-persistedstate'

export default defineNuxtPlugin(({ store }) => {
  createPersistedState({})(store)
})
