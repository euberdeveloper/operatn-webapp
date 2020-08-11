import Vue from 'vue'

const getDefaultState = () => {
  return {
    people: [],
    loading: false,
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState())
    },
    setPeople(state, val) {
      state.people = val
    },
    setLoading(state, val) {
      state.loading = val
    },
  },
  actions: {
    loadPeople({ commit }) {
      commit('setLoading', true)
      Vue.prototype.$api
        .get("/person/signer")
        .then(
          res => {
            res.data.map(x => {
              x['_dal'] = (new Date(x.dal)).toLocaleDateString('it-IT')
              x['_al'] = (new Date(x.al)).toLocaleDateString('it-IT')
              x['data nascita'] = (new Date(x.data_nascita)).toLocaleDateString('it-IT')
            })
            commit('setPeople', res.data)
            commit('setLoading', false)
          },
          error => {
            commit('setPeople', [])
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
    register({ dispatch }, val) {
      Vue.prototype.$api.post(`/person/signer`, val).then(() => {
        dispatch('loadPeople')
      }, error => console.log(error))
    },
    deleteSigner({ commit, dispatch }, usr) {
      commit('setLoading', true)
      Vue.prototype.$api
        .delete(`/person/signer/${usr.idsign}`)
        .then(
          () => {
            dispatch('loadPeople')
          },
          error => {
            console.error(error);
            commit('setLoading', false)
          }
        );
    },
  }
}