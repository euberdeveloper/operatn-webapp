import Vue from 'vue'
import moment from 'moment'

const getDefaultState = () => {
  return {
    fabbricati: [],
    tipiContratti: [],
    tipiUtente: [],
    tariffe: [],
    quietanzianti: [],
    utilizziStanza: [],
    tipiRate: ['GIORNALIERA', 'MENSILE'],
    tipiTariffa: [],
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
      quiet: null,
      pagante: null,
    },
    paganti: [],
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
    setTariffe(state, val) {
      state.tariffe = val
    },
    setTipiTariffa(state, val) {
      state.tipiTariffa = val
    },
    setQuietanzianti(state, val) {
      state.quietanzianti = val
    },
    setUtilizziStanza(state, val) {
      state.utilizziStanza = val
    },
    setTipiUtente(state, val) {
      state.tipiUtente = val
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
    setImportoCanone(state, val) {
      state.importi.totale_canone = val;
    },
    setImportoConsumi(state, val) {
      state.importi.totale_consumi = val;
    },
    setPaganti(state, val) {
      state.paganti = val;
    },
    setPagante(state, val) {
      state.importi.pagante = val;
    },
    setQuiet(state, val) {
      state.importi.quiet = val;
    },
  },
  actions: {
    loadPaganti({ commit }) {
      Vue.prototype.$api
        .get("/ragioneria/paganti")
        .then(
          res => {
            console.log(res.data);
            commit('setPaganti', res.data.rows)
          },
          error => {
            commit('setPaganti', [])
            console.error(error)
          }
        )
    },
    async loadTipiUtente({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/tipi-ospite");
        commit('setTipiUtente', response.data.map(el => ({ ...el, desc: `${el.sigla} - ${el.tipoOspite}` })));
      }
      catch (error) {
        commit('setTipiUtente', []);
        console.error(error);
      }
    },
    async loadUtilizziStanza({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/utilizzi-stanza");
        commit('setUtilizziStanza', response.data.map(el => ({ ...el, desc: el.utilizzoStanza })));
      }
      catch (error) {
        commit('setUtilizziStanza', []);
        console.error(error);
      }
    },
    async loadFabbricati({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/fabbricati?tipoFabbricato=true");
        commit('setFabbricati', response.data.map(fabbricato => ({ ...fabbricato, desc: `${fabbricato.codice} - ${fabbricato.nome}` })))
      }
      catch (error) {
        commit('setFabbricati', [])
        console.error(error)
      }
    },
    async loadQuietanzianti({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/quietanzianti");
        commit('setQuietanzianti', response.data.map(q => ({ ...q, desc: q.quietanziante })))
      }
      catch (error) {
        commit('setQuietanzianti', [])
        console.error(error)
      }
    },
    async loadTariffe({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/tariffe?tipoOspite=true&utilizzoStanza=true&tipoFabbricato=true&tipoTariffa=true");
        commit('setTariffe', response.data)
      }
      catch (error) {
        commit('setTariffe', [])
        console.error(error)
      }
    },
    async loadTipiTariffa({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/tipi-tariffa");
        commit('setTipiTariffa', response.data.map(el => ({ ...el, desc: el.tipoTariffa })))
      }
      catch (error) {
        commit('setTipiTariffa', [])
        console.error(error)
      }
    },
    async loadTipiContratti({ commit }) {
      try {
        const response = await Vue.prototype.$api.get("/tipi-contratto");
        commit('setTipiContratti', response.data.map(t => ({ ...t, desc: `${t.sigla} - ${t.nome}` })))
      }
      catch (error) {
        commit('setTipiContratti', [])
        console.error(error)
      }
    },
    async loadContratti({ commit, state }) {
      let op;
      switch (state.operazione) {
        case 'Modifica / Annulla':
        case 'Da Firmare':
          op = 'da-firmare';
          break;
        case 'Firmati':
          op = 'da-contabilizzare';
          break;
        case 'Contabilizzati':
          op = 'contabilizzati';
          break;
        case 'Chiusura Anticipata':
          op = 'bo';
          break;
        case 'Proroga':
          op = 'bo';
          break;
        default:
          return;
      }
      try {
        const response = await Vue.prototype.$api.get(`/contratti/${op}`);
        commit('setContratti', response.data.map(c => ({
          id: c.id,
          data_inizio: c.dataInizio,
          data_fine: c.dataFine,
          nome: c.contrattiSuOspite?.[0].ospite.persona.nome,
          cognome: c.contrattiSuOspite?.[0].ospite.persona.cognome,
          stanza: c.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto?.[0]?.postoLetto?.stanza?.numeroStanza,
          fabbricato: c.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto?.[0]?.postoLetto?.stanza?.fabbricato?.codice
        })));
      }
      catch (error) {
        commit('setContratti', [])
        console.error(error)
      }
    },
    submit({ state, commit, dispatch }, val) {
      console.log(state);
      Vue.prototype.$api
        .post(`/contratti`, val)
        .then(
          () => {
            commit('setSuccess', 'Inserimento eseguito con successo')
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
    cancelSignContract({ dispatch }, val) {
      Vue.prototype.$api
        .delete(`/ragioneria/contratto/${val.id}?deletesign=true`)
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
        .post(`/ragioneria/contratto/${val.id}?close=true&data=${val.data_firma}`)
        .then(
          () => {
            dispatch('loadContratti')
          },
          error => {
            console.error(error)
          }
        )
    },
    dateSign({ dispatch }, val) {
      Vue.prototype.$api
        .post(`/ragioneria/contratto/${val.id}?datesign=true&data=${val.data_firma}`)
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
    cancelSign({ dispatch, commit, state }) {
      console.log(state.modifica);
      dispatch('cancelSignContract', state.modifica)
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