export const state: { token: null | string; loggedIn: boolean } = {
  token: null,
  loggedIn: false,
}

export type State = typeof state

export const getters = {
  token: (state: State) => state.token,
  auth: (state: State) => state.loggedIn,
}

export const mutations = {
  setToken(state: State, token: string) {
    state.token = token
    state.loggedIn = token !== null
  },
}
