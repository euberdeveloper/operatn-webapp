import Vue from 'vue'

const getDefaultState = () => {
  return {
    user: null,
    interceptor : null,
    role: -1
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    set_role(state, role){
      state.role = role
    },
    auth_success(state, user){
      state.user = user
      state.role = user.ruolo
      state.interceptor = Vue.prototype.$api.interceptors.request.use(function (config) {
        const token = user.accesstoken
        config.headers.Authorization =  'Bearer ' + token
        return config
      })
    },
    logout(state){
      state.user = null
      if (state.interceptor)
        Vue.prototype.$api.interceptors.request.eject(state.interceptor)
    },
  },
  actions: {
    load({ commit }) {
      if (localStorage.getItem('user'))
        commit('auth_success', JSON.parse(localStorage.getItem('user')))
    },
    login({ commit }, input) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$api.post("/auth/login", input).then(result => {
          localStorage.setItem('user', JSON.stringify(result.data))
          commit('auth_success', result.data)
          resolve(result.data)
        }, error => {
          reject(error)
        });
      })
    },
    logout({commit}) {
      // eslint-disable-next-line no-unused-vars
      return new Promise((resolve, reject) =>{
        commit('logout')
        localStorage.removeItem('user')
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
  }
}