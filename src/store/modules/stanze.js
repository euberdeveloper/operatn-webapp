import Vue from 'vue'

const getDefaultState = () => {
  return {
    studentati: [],
    piani: [],
    stanze: [],
    contratti: [],
    loading: false,
    contratto: null,
    studentato: null,
    piano: null,
    stanza: null,
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    setStanza(state, val) {
      state.stanza = val
    },
    setPiano(state, val) {
      state.piano = val
    },
    setStudentato(state, val) {
      state.studentato = val
    },
    setStanze(state, val) {
      state.stanze = val
    },
    setPiani(state, val) {
      state.piani = val
    },
    setStudentati(state, val) {
      state.studentati = val
    },
    setLoading(state, val) {
      state.loading = val
    },
    setContratti(state, val) {
      state.contrati = val
    },
    editContratto(state, val) {
      state.contratto = val
    }
  },
  actions: {
    loadStudentati({ commit }) {
      commit('setLoading', true)
      Vue.prototype.$api.get(`/studentati`).then(result => {
        commit('setStudentati', result.data)
        commit('setLoading', false)
      }, err => {
        console.error(err)
        commit('setStudentati', [])
      })
    },
    loadPiani({ commit }, val) {
      commit('setStanze', [])
      commit('setLoading', true)
      Vue.prototype.$api.get(`/studentati/${val}/piani`).then(result => {
        commit('setPiani', result.data)
        commit('setLoading', false)
      }, () => {
        commit('setPiani', [])
      })
    },
    loadStanze({ commit, state }, val) {
      commit('setLoading', true)
      Vue.prototype.$api.get(`/studentati/${state.studentato}/piani/${val}/stanze`).then(result => {
        commit('setStanze', result.data)
        commit('setLoading', false)
      }, () => {
        commit('setStanze', [])
      })
    },
    loadStanzaHistory({ commit, state }, val) {
      commit('setLoading', true)
      Vue.prototype.$api.get(`/studentati/${state.studentato}/piani/${state.piano}/stanze/${val}/contratti`).then(result => {
        result.data.map(x => {
          x['inizio contratto'] = (new Date(x.inizio_contratto)).toLocaleDateString('it-IT')
          x['fine contratto'] = (new Date(x.fine_contratto)).toLocaleDateString('it-IT')
          if (x.check_in)
            x['check in'] = (new Date(x.check_in)).toLocaleString('it-IT')
          if (x.check_out)
            x['check out'] = (new Date(x.check_out)).toLocaleString('it-IT')
        })
        state.contratti = result.data
        commit('setContratti', result.data)
        commit('setLoading', false)
      }, () => {
        commit('setContratti', [])
      })
    },
  }
}