import Vue from 'vue'

const getDefaultState = () => {
  return {
    users: [],
    loading: false
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    set_role(state, role) {
      state.role = role
    },
    setUsers(state, users) {
      state.users = users
    },
    addUser(state, usr) {
      state.users.push(usr);
    },
    setLoading(state, val) {
      state.loading = val
    }
  },
  actions: {
    loadUsers({ commit }) {
      commit('setLoading', true)
      Vue.prototype.$api
        .get("/user")
        .then(
          res => {
            commit('setUsers', res.data)
            commit('setLoading', false)
          },
          error => {
            commit('setUsers', [])
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
    newUser({ commit }, usr) {
      commit('setLoading', true)
      Vue.prototype.$api
        .post("/user", usr)
        .then(
          res => {
            commit('addUser', res.data)
            commit('setLoading', false)
          },
          error => {
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
    editUser({ commit, state }, usr) {
      commit('setLoading', true)
      Vue.prototype.$api
        .post(`/user/${usr.id}`, usr)
        .then(
          res => {
            commit('setUsers', state.users.map(x => {
              if (x.id == usr.id)
                return res.data
              else
                return x
            }))
            commit('setLoading', false)
          },
          error => {
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
    deleteUser({ commit, state }, usr) {
      commit('setLoading', true)
      Vue.prototype.$api
        .delete(`/user/${usr.id}`)
        .then(
          () => {
            commit('setUsers', state.users.filter(x => {
              return !(x.id == usr.id)
            }))
            commit('setLoading', false)
          },
          error => {
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
  },
}