import Vue from 'vue'

const getDefaultState = () => {
  return {
    user: null,
    interceptor: null,
    role: -1
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState())
    },
    set_role(state, role) {
      state.role = role
    },
    add_interceptor(state, token) {
      state.interceptor = Vue.prototype.$api.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    },
    set_user(state, user) {
      state.user = user;
      state.role = user.ruolo;
    },
    logout(state) {
      state.user = null
      if (state.interceptor)
        Vue.prototype.$api.interceptors.request.eject(state.interceptor)
    },
  },
  actions: {
    async load({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        commit('add_interceptor', token);
        const apiResult = await Vue.prototype.$api.get("/utenti/me");
        const user = apiResult.data;  
        commit('set_user', user);
      }
    },
    async login({ commit }, input) {
      const result = await Vue.prototype.$api.post("/auth/login", input);
      const data = result.data;
      localStorage.setItem('token', data.token);
      commit('add_interceptor', data.token)
      commit('set_user', data.user)
      return result.data;
    },
    async logout({ commit }) {
      commit('logout');
      localStorage.removeItem('token')
    }
  },
  getters: {
    isLoggedIn: state => !!state.user,
  }
}