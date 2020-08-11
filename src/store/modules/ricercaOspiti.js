import Vue from 'vue'

const getDefaultState = () => {
  return {
    entries: [],
    isLoading: false,
    model: null,
    confirm: null,
    consegna: {
      lenzuola: false,
      chiavi: false,
      badge: false
    }
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    loadNames(state, values) {
      state.entries = values
      state.isLoading = false
    },
    setModel(state, val) {
      state.model = val
    },
    setLoading(state, val) {
      state.isLoading = val
    },
    setConfirm(state, val) {
      state.confirm = val
    },
    setConsegna(state, val) {
      state.consegna = val
    },
  },
  actions: {
    search({ commit }, val) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$api.get(`/frontDesk/contract?search=${val}`).then(result => {
          commit('loadNames', result.data)
          resolve()
        }, error => reject(error))
      })
    },
    checkin({ commit }) {
      commit('setConfirm', {
        action: 'check-in'
      })
    },
    checkout({ commit }) {
      commit('setConfirm', {
        action: 'check-out'
      })
    },
    _discard({ commit }) {
      commit('setConfirm', null)
    },
    _confirm({ dispatch, state }) {
      if (state.confirm.action == 'check-in')
        dispatch('real_checkin')
      else if (state.confirm.action == 'check-out')
        dispatch('real_checkout')
      dispatch('_discard')
    },
    real_checkin({ commit, state }) {
      commit('setLoading', true)
      Vue.prototype.$api.post(`/frontDesk/checkin`, { id: state.model.id, date: new Date() }).then(() => {
        let s = state.model
        s.check_in = new Date()
        commit('setModel', s)
        commit('setLoading', false)
      }, error => {
        console.error(error)
        commit('setLoading', false)
      })
    },
    real_checkout({ commit, state }) {
      commit('setLoading', true)
      Vue.prototype.$api.post(`/frontDesk/checkout`,
        { id: state.model.id, date: new Date(), chiavi: state.consegna.chiavi, badge: state.consegna.badge, lenzuola: state.consegna.lenzuola }).then(() => {
          let s = state.model
          s.check_out = new Date()
          commit('setModel', s)
          commit('setLoading', false)
        }, error => {
          console.error(error)
          commit('setLoading', false)
        })
    },
    undo_checkin({ commit, state }) {
      commit('setLoading', true)
      Vue.prototype.$api.post(`/frontDesk/checkin`, { id: state.model.id}).then(() => {
        let s = state.model
        s.check_in = null
        commit('setModel', s)
        commit('setLoading', false)
      }, error => {
        console.error(error)
        commit('setLoading', false)
      });
    },
    undo_checkout({ commit, state }) {
      commit('setLoading', true)
      Vue.prototype.$api.post(`/frontDesk/checkout`,
        { id: state.model.id }).then(() => {
          let s = state.model
          s.check_out = null
          commit('setModel', s)
          commit('setLoading', false)
        }, error => {
          console.error(error)
          commit('setLoading', false)
        })
    },
  }
}