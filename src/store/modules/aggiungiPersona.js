import Vue from 'vue'

const getDefaultState = () => {
  return {
    progress: 1,
    anagrafica: {
      cognome: '',
      nome: '',
      sesso: '',
      data_nascita: '',
      stato_nascita: 'ITALIA',
      provincia_nascita: '',
      comune_nascita: '',
      email: '',
      codice_unitn_dipartimenti:'',
      telefono: ''
    },
    documento: {
      tipo: '',
      ente: '',
      numero: '',
      data_rilascio: '',
      validita: '',
      cittadinanza: 'ITALIA',
      codice_fiscale: '',
    },
    residenza: {
      stato: 'ITALIA',
      provincia: '',
      comune: '',
      indirizzo: '',
      numero: '',
      cap: '',
      dal: '',
    },
    dom_diverso: false,
    domicilio: {
      stato: 'ITALIA',
      provincia: '',
      comune: '',
      indirizzo: '',
      numero: '',
      cap: '',
      dal: '',
    },
    banca: {
      iban: '',
      descrizione_banca: '',
      swift_bic: '',
      aba: '',
      transit_code: ''
    },
    stati: [],
    province: [],
    comuni: [],
    dipartimenti: [],
    isModifica: false,
    persona: null,
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState())
    },
    setStati(state, val) {
      state.stati = val.filter(x => !!x.denominazione_stato).map(x => {
        x.denominazione_stato = x.denominazione_stato.trim()
        return x
      })
    },
    setProvince(state, val) {
      state.province = val.map(x => x.denominazione_provincia.trim())
    },
    setComuni(state, val) {
      state.comuni = val
    },
    setProgress(state, val) {
      state.progress = val
    },
    setDomDiverso(state, val) {
      state.dom_diverso = val
    },
    setAnagrafica(state, val) {
      state.anagrafica = val
      if (!state.residenza.dal)
        state.residenza.dal = state.anagrafica.data_nascita
    },
    setDocumento(state, val) {
      state.documento = val
    },
    setResidenza(state, val) {
      state.residenza = val
    },
    setDomicilio(state, val) {
      state.domicilio = val
    },
    setDipartimenti(state, val) {
      state.dipartimenti = val
    },
    setBanca(state, val) {
      state.banca = val
    },
    setFacolta(state, val) {
      state.anagrafica.codice_unitn_dipartimenti = val
    },
    setModifica(state, val) {
      state.isModifica = val
      state.anagrafica = getDefaultState().anagrafica
      state.banca = getDefaultState().banca
      state.residenza = getDefaultState().residenza
      state.domicilio = getDefaultState().domicilio
      state.documento = getDefaultState().documento
    },
    setPersona(state, val) {
      state.persona = val
    },
  },
  actions: {
    loadStati({ commit }) {
      Vue.prototype.$api
        .get("/geo/stati")
        .then(
          res => {
            commit('setStati', res.data)
          },
          error => {
            console.error(error)
            commit('setStati', [])
          }
        )
    },
    loadDipartimenti({ commit }) {
      Vue.prototype.$api
        .get("/uni/dipartimenti")
        .then(
          res => {
            commit('setDipartimenti', res.data)
          },
          error => {
            console.error(error)
            commit('setDipartimenti', [])
          }
        )
    },
    loadProvince({ commit }) {
      Vue.prototype.$api
        .get("/geo/province")
        .then(
          res => {
            commit('setProvince', res.data)
          },
          error => {
            console.error(error)
            commit('setProvince', [])
          }
        )
    },
    searchComune({ commit }, val) {
      Vue.prototype.$api
        .get(`/geo/comuni?search=${val}`)
        .then(
          res => {
            commit('setComuni', res.data)
          },
          error => {
            console.error(error)
            commit('setComuni', [])
          }
        )
    },
    // eslint-disable-next-line no-unused-vars
    upload({ commit, state }) {
      commit('setProgress', 8)
      let payload = {
        anagrafica: state.anagrafica,
        documento: state.documento,
        residenza: state.residenza,
        domicilio: state.dom_diverso ? state.domicilio : state.residenza,
        facolta: state.facolta,
        banca: state.banca
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.$api
          .post(`/person${state.isModifica ? ('/' + state.persona.id) : ''}`, payload)
          .then(
            () => {
              setTimeout(() => {
                commit('resetState')
                resolve()
              }, 500)
            },
            error => {
              commit('setProgress', 1)
              alert('Controlla di aver compilato tutti i campi e che siano validi')
              reject()
              console.error(error)
            }
          )
      })
    },
  }
}