import Vue from 'vue'
import moment from 'moment'

const getDefaultState = () => {
  return {
    fabbricati: [],

    tipiContratti: [],
    tipiUtente: [],
    tipiRate: [],
    operazione: '',
    contratti: [],
    alertSucc: '',
    nuovo: {
      inizio: "",
      fine: "",
      persona: false,
      fabbricato: "",
      stanza: "",
      contratto: "",
      annoContratto: `${(new Date()).getFullYear()}/${(new Date()).getFullYear() + 1}`,
      contabilizzato: false,
      cod_tipoutente: "",
      id_tipo_stanza: "",
      id_utilizzo_stanza: -1,
    },
    modifica: {
      inizio: "",
      fine: "",
      persona: false,
      fabbricato: "",
      stanza: "",
      contratto: "",
      contabilizzato: true,
      id_tipo_stanza: "",
      id_utilizzo_stanza: -1,
    },
    proroga: null,
    tab: 0,
    dialogContratto: false,
    importi: {
      totale_canone: null,
      totale_consumi: null,
    },
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState())
    },
    resetStateWithKey(state, val) {
      state[val] = getDefaultState()[val]
    },
    setFabbricati(state, val) {
      state.fabbricati = val
    },
    setTipiUtente(state, val) {
      state.tipiUtente = val
    },
    setTipiRate(state, val) {
      state.tipiRate = val
    },
    setTipiContratti(state, val) {
      state.tipiContratti = val
    },
    setNuovo(state, val) {
      state.nuovo = val
    },
    setModifica(state, val) {
      state.modifica = val
    },
    setTab(state, val) {
      state.tab = val
    },
    setOperazione(state, val) {
      state.operazione = val
    },
    setContratti(state, val) {
      state.contratti = val
    },
    setDialogContratto(state, val) {
      state.dialogContratto = val
    },
    setEditContratto(state, val) {
      state.modifica = val
    },
    setSuccess(state, val) {
      state.alertSucc = val
    },
    setImportoCanone(state, val){
      state.importi.totale_canone = val;
    },
    setImportoConsumi(state, val){
      state.importi.totale_consumi = val;
    }
  },
  actions: {
    loadTipiUtente({ commit }) {
      Vue.prototype.$api
        .get("/ragioneria/tipi/utente")
        .then(
          res => {
            commit('setTipiUtente', res.data)
          },
          error => {
            commit('setTipiUtente', [])
            console.error(error)
          }
        )
    },
    loadTipiRate({ commit }) {
      Vue.prototype.$api
        .get("/ragioneria/tipi/rata")
        .then(
          res => {
            commit('setTipiRate', res.data)
          },
          error => {
            commit('setTipiRate', [])
            console.error(error)
          }
        )
    },
    loadFabbricati({ commit }) {
      Vue.prototype.$api
        .get("/fabbricati")
        .then(
          res => {
            commit('setFabbricati', res.data.map(x => {
              x.desc = x.codice_fabbricato + ' ' + x.descrizione_fabbricato
              return x
            }))
          },
          error => {
            commit('setFabbricati', [])
            console.error(error)
          }
        )
    },
    loadTipiContratti({ commit }) {
      Vue.prototype.$api
        .get("/ragioneria/tipi")
        .then(
          res => {
            commit('setTipiContratti', res.data.map(x => {
              x.desc_sigla = x.sigla + ' - ' + x.descrizione
              return x;
            }))
          },
          error => {
            commit('setTipiContratti', [])
            console.error(error)
          }
        )
    },
    loadContratti({ commit, state }) {
      if (!state.operazione)
        return;
      Vue.prototype.$api
        .get(`/ragioneria/contratto?filter=${state.operazione.toLowerCase().split(' ')[0]}`)
        .then(
          res => {
            commit('setContratti', res.data.map(x => {
              x.data_inizio = moment(x.data_inizio).format('YYYY-MM-DD')
              x.data_fine = moment(x.data_fine).format('YYYY-MM-DD')
              x.data_nascita = moment(x.data_nascita).format('YYYY-MM-DD')
              return x;
            }))
          },
          error => {
            commit('setContratti', [])
            console.error(error)
          }
        )
    },
    submit({ state, commit, dispatch }, val) {
      let obj = val ? val : state.nuovo

      Vue.prototype.$api
        .post(`/ragioneria/contratto${(val && !val.proroga) ? '/' + val.id : ''}`, {
          id_anagrafica_persona: obj.persona.id,
          id_anagrafica_alloggio: obj.stanza.id,
          id_rag_tipo_contratto: obj.tipoContratto.id,
          id_rag_tariffa: obj.tariffa.id,
          data_inizio: obj.inizio,
          data_fine: obj.fine,
          anno_accademico: obj.annoContratto,
          id_tipo_rata: obj.id_tipo_rata,
          id_utilizzo_stanza: obj.id_utilizzo_stanza == -1 ? obj.stanza.id_tipo_stanza : obj.id_utilizzo_stanza,
          totale_canone: state.importi.totale_canone,
          totale_consumi: state.importi.totale_consumi
        })
        .then(
          () => {
            commit('setSuccess', val ? 'Modifica eseguita con successo' : 'Inserimento eseguito con successo')
            commit('setDialogContratto', false)
            commit('resetStateWithKey', val ? 'modifica' : 'nuovo')
            dispatch('loadContratti')
            setTimeout(() => commit('setSuccess', false), 5000)
          },
          error => {
            // commit('setTipiContratti', [])
            console.error(error)
          }
        )
    },
    deleteItem({ dispatch }, val) {
      Vue.prototype.$api
        .delete(`/ragioneria/contratto/${val.id}`)
        .then(
          () => {
            dispatch('loadContratti')
          },
          error => {
            console.error(error)
          }
        )
    },
    signItem({ dispatch }, val) {
      Vue.prototype.$api
        .post(`/ragioneria/contratto/${val.id}?sign=true`)
        .then(
          () => {
            dispatch('loadContratti')
          },
          error => {
            console.error(error)
          }
        )
    },
    closeItem({ dispatch }, val) {
      Vue.prototype.$api
        .post(`/ragioneria/contratto/${val.id}?close=true`)
        .then(
          () => {
            dispatch('loadContratti')
          },
          error => {
            console.error(error)
          }
        )
    },
    deleteContract({ dispatch, commit, state }) {
      dispatch('deleteItem', state.modifica)
      commit('setDialogContratto', false)
    },
    loadEditContratto({ commit }, val) {
      commit('setDialogContratto', true)
      console.log(val)
      Vue.prototype.$api
        .get(`/ragioneria/contratto/${val.id}`)
        .then(
          // {
          //   inizio: "",
          //   fine: "",
          //   persona: false,
          //   fabbricato: "",
          //   stanza: "",
          //   contratto: "",
          //   annoContratto: `${(new Date()).getFullYear()}/${(new Date()).getFullYear() + 1}`,
          //   importi: "",
          //   contabilizzato: false,
          //   cod_tipoutente: "",
          //   tariffa: {
          //     id: 1
          //   }
          // }
          res => {
            console.log(res)
            commit('setEditContratto', {
              id: res.data.id,
              persona: res.data.persona,
              stanza: res.data.stanza,
              fabbricato: res.data.fabbricato,
              tipoContratto: res.data.contratto,
              tariffa: res.data.tariffa,
              cod_tipoutente: res.data.tipoUtente,
              inizio: val.proroga ? '' : moment(res.data.data_inizio).format('YYYY-MM-DD'),
              fine: val.proroga ? '' : moment(res.data.data_fine).format('YYYY-MM-DD'),
              annoContratto: res.data.anno_accademico,
              id_tipo_rata: res.data.id_tipo_rata,
              id_utilizzo_stanza: res.data.id_utilizzo_stanza,
              proroga: val.proroga,
            })

          },
          error => {
            // commit('setTipiContratti', [])
            console.error(error)
          }
        )
    }
  }
}