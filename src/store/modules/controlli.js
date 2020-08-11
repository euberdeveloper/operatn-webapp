import Vue from 'vue'

const getDefaultState = () => {
  return {
    dates: [],
    items: [],
    isLoading: false
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState (state) {
      Object.assign(state, getDefaultState())
    },
    setLoading(state, val) {
      state.isLoading = val
    },
    setItems(state, val) {
      state.items = val
    },
    setDates(state, val) {
      val.sort()
      state.dates = val
    }
  },
  actions: {
    contratti({ commit, state }, inout) {
      commit('setLoading', true)
      Vue.prototype.$api.get(`/frontDesk/contract?start=${state.dates[0]}&end=${state.dates[1]}&check=${false}&inout=${inout}`).then(result => {
        result.data.map(x => {
          x['inizio contratto'] = (new Date(x.inizio_contratto)).toLocaleDateString('it-IT')
          x['fine contratto'] = (new Date(x.fine_contratto)).toLocaleDateString('it-IT')
          if (x.check_in)
            x['check in'] = (new Date(x.check_in)).toLocaleString('it-IT')
          if (x.check_out)
            x['check out'] = (new Date(x.check_out)).toLocaleString('it-IT')
        })
        commit('setItems', result.data)
        commit('setLoading', false)
      }, error => {
        commit('setItems', [])
        console.error(error)
        commit('setLoading', false)
      })
    },
    checkin({ commit, state }, inout) {
      commit('setLoading', true)
      Vue.prototype.$api.get(`/frontDesk/contract?start=${state.dates[0]}&end=${state.dates[1]}&check=${true}&inout=${inout}`).then(result => {
        result.data.map(x => {
          x['inizio contratto'] = (new Date(x.inizio_contratto)).toLocaleDateString('it-IT')
          x['fine contratto'] = (new Date(x.fine_contratto)).toLocaleDateString('it-IT')
          x['fabbricato'] = x['descrizione_fabbricato']
          x['stanza'] = x['numero_stanza']
          if (x.check_in)
            x['check in'] = (new Date(x.check_in)).toLocaleString('it-IT')
          if (x.check_out)
            x['check out'] = (new Date(x.check_out)).toLocaleString('it-IT')
        })
        commit('setItems', result.data)
        commit('setLoading', false)
      }, error => {
        commit('setItems', [])
        console.error(error)
        commit('setLoading', false)
      })
    }
  }
}