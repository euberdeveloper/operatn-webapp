<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title {{isModifica?'Modifica':'Nuova'}} persona
    v-spacer
    v-divider.mr-1(vertical)
    v-tooltip(bottom)
      template(v-slot:activator='{ on }')
        v-btn(v-on='on', icon, @click="isModifica = !isModifica")
          v-icon(v-if="!isModifica") mdi-account-search
          v-icon(v-else) mdi-account-plus
      span(v-if="!isModifica") Cerca persona da modificare
      span(v-else) Inserimento nuova persona
    
      
  v-expand-x-transition
    v-alert.ma-2(dismissible, type="success", v-show="success") Inserimento completato con successo
  div(v-if="isModifica")
    v-row
      v-col.mt-5(cols='12', md='2')
        span.ml-4.body-1 Persona da modificare
      v-col
        user-select.mt-4(v-model="persona", prepend-icon='mdi-badge-account', return-object)
  v-stepper.elevation-0(v-model='progress', vertical, v-if="!isModifica || (isModifica && !!persona)")
    v-stepper-step(:complete='progress > 1', step='1')
      | Anagrafica
      small
        | {{anagrafica.nome || 'Nome'}}, {{anagrafica.cognome || 'Cognome'}}, {{anagrafica.sesso || 'Sesso'}}...
    v-stepper-content(step='1')
      v-form.mb-2(v-if='progress == 1', ref='formAnagrafica', v-model='validAnagrafica')
        v-row
          v-col(cols='12', sm='5')
            v-text-field(v-model='anagrafica.cognome', dense, required, label='Cognome', :rules='notNull')
          v-col(cols='12', sm='5')
            v-text-field(v-model='anagrafica.nome', dense, required, label='Nome', :rules='notNull')
          v-col(cols='12', sm='2')
            v-autocomplete(v-model='anagrafica.sesso', dense, required, label='Sesso', :items="['F','M']", :rules='notNull')
          v-col(cols='12', sm='6')
            input-date-picker(v-model='anagrafica.data_nascita', dense, required, label='Data nascita', :rules='notNull')
          v-col(cols='12', sm='6')
            v-autocomplete(
              v-model='anagrafica.stato_nascita', :items='stati', item-text='denominazione_stato',
              dense, required, label='Stato nascita', :rules='notNull' )
          v-col(cols='12', sm='6', v-if="anagrafica.stato_nascita.indexOf('ITALIA') != -1")
            v-autocomplete(:items='province', v-model='anagrafica.provincia_nascita', item-text='denominazione_provincia', dense, required, label='Provincia nascita', :rules='notNull')
          v-col(cols='12', sm='6', v-if="anagrafica.stato_nascita.indexOf('ITALIA') != -1")
            v-autocomplete( 
              :items='comuni', :search-input.sync='search_comune', v-model='anagrafica.comune_nascita',
              item-text='denominazione_comune', hide-no-data, dense, required, label='Comune nascita',
              :rules='notNull')
          v-col(cols='12', sm='6')
            v-text-field(v-model='anagrafica.email', dense, required, label='Email', type="email", :rules='emailRules')
          v-col(cols='12', sm='6')
            v-text-field(v-model='anagrafica.telefono', dense, required, label='Tel.', type="phone", :rules='phoneRules')
      v-btn(color='primary', @click='nextStep', :disabled='!validAnagrafica') Continua
    v-stepper-step(:complete='progress > 2', step='2') Documento
    v-stepper-content(step='2')
      v-form.mb-2(v-if='progress == 2', ref='formDocumento',  v-model='validDocumento')
        v-row
          v-col(cols='12', sm='6', md='3')
            v-autocomplete(v-model='documento.tipo', :items="['Carta di identità', 'Passaporto', 'Patente', 'Altro']", dense, required, label='Tipo', :rules='notNull')
          v-col(cols='12', sm='6', md='3')
            v-text-field(v-model='documento.ente', dense, required, label='Ente Rilasciante', :rules='notNull')
          v-col(cols='12', sm='6', md='2')
            v-text-field(v-model='documento.numero', dense, required, label='Numero', :rules='notNull')
          v-col(cols='12', sm='6', md='2')
            input-date-picker(v-model='documento.data_rilascio', dense, required, label='Data Rilascio', :rules='notNull')
          v-col(cols='12', sm='6', md='2')
            input-date-picker(v-model='documento.validita', dense, required, label='Validita', :rules='notNull')
          v-col(cols='12', sm='6')
            v-autocomplete(v-model='documento.cittadinanza', :items='stati', item-text='denominazione_stato', dense, required, label='Cittadinanza', :rules='notNull')
          v-col(cols='12', sm='6')
            v-text-field(v-model='documento.codice_fiscale', maxlength='16', counter, dense, required, label='Codice Fiscale', :rules='codFisRule')
      v-btn(color='primary', @click='nextStep') Continua
      v-btn(text, @click='progress--') Annulla
    v-stepper-step(:complete='progress > 3', step='3') Residenza
    v-stepper-content(step='3')
      v-form.mb-2(v-if='progress == 3', ref='formResidenza',  v-model='validResidenza')
        v-row
          v-col(cols='12', sm='4')
            v-autocomplete(v-model='residenza.stato', :items='stati', item-text='denominazione_stato', dense, required, label='Stato', :rules='notNull')
          v-col(cols='12', sm='4', v-if="residenza.stato.indexOf('ITALIA') != -1")
            v-autocomplete(:items='province', v-model='residenza.provincia', item-text='denominazione_provincia', dense, required, label='Provincia', :rules='notNull')
          v-col(cols='12', sm='4', v-if="residenza.stato.indexOf('ITALIA') != -1")
            v-autocomplete(:items='comuni', :search-input.sync='search_comune', v-model='residenza.comune', item-text='denominazione_comune', hide-no-data, dense, required, label='Comune', :rules='notNull')
          v-col(cols='12', sm='7')
            v-text-field(v-model='residenza.indirizzo', dense, required, label='Indirizzo', :rules='notNull')
          v-col(cols='12', sm='2')
            v-text-field(v-model='residenza.numero', dense, required, label='Numero', :rules='notNull')
          v-col(cols='12', sm='3')
            v-text-field(v-model='residenza.cap', dense, required, label='CAP', :rules='numberRule')
      v-btn(color='primary', @click='nextStep') Continua
      v-btn(text, @click='progress--') Annulla
    v-stepper-step(:complete='progress > 4', step='4') Domicilio
    v-stepper-content(step='4')
      v-switch.ml-3.mb-0(v-model='dom_diverso', label='Domicilio diverso da alloggio')
      v-form(ref='formDomicilio',  v-model='validDomicilio')
        div(v-if='dom_diverso && progress == 4')
          v-row
            v-col(cols='12', sm='4')
              v-autocomplete(v-model='domicilio.stato', :items='stati', item-text='denominazione_stato', dense, required, label='Stato', :rules='notNull')
            v-col(cols='12', sm='4', v-if="domicilio.stato.indexOf('ITALIA') != -1")
              v-autocomplete(:items='province', v-model='domicilio.provincia', item-text='denominazione_provincia', dense, required, label='Provincia', :rules='notNull')
            v-col(cols='12', sm='4', v-if="domicilio.stato.indexOf('ITALIA') != -1")
              v-autocomplete(:items='comuni', :search-input.sync='search_comune', v-model='domicilio.comune', item-text='denominazione_comune', hide-no-data, dense, required, label='Comune', :rules='notNull')
            v-col(cols='12', sm='7')
              v-text-field(v-model='domicilio.indirizzo', dense, required, label='Indirizzo', :rules='notNull')
            v-col(cols='12', sm='2')
              v-text-field(v-model='domicilio.numero', dense, required, label='Numero', :rules='numberRule')
            v-col(cols='12', sm='3')
              v-text-field(v-model='domicilio.cap', dense, required, label='CAP', :rules='numberRule')
      v-btn(color='primary', @click='nextStep') Continua
      v-btn(text, @click='progress--') Annulla
    v-stepper-step(:complete='progress > 5', step='5') Facoltà
    v-stepper-content(step='5')
      v-form(ref='formFacolta',  v-model='validFacolta')
        v-autocomplete(
          :items='dipartimenti',
          v-model='facolta', item-value='codice'
          item-text='descrizione', required, label='Facolta', :rules='notNull')
      v-btn(color='primary', @click='nextStep') Continua
      v-btn(text, @click='progress--') Annulla
    v-stepper-step(:complete='progress > 6', step='6') Dati Bancari
    v-stepper-content(step='6')
      v-form.mb-2(v-if='progress == 6', ref='formBanca',  v-model='validBanca')
        v-row
          v-col(cols='12')
            v-text-field(v-model='banca.descrizione_banca', dense, required, label='Descrizione banca', :rules='notNull')
          v-col(cols='12')
            v-text-field(v-model='banca.iban', dense, required, label='IBAN')
          v-col(cols='12')
            v-text-field(v-model='banca.aba', dense, required, label='ABA (USA)', counter='9')
          v-col(cols='12')
            v-text-field(v-model='banca.agenzia', dense, required, label='AGENZIA (BRASILE)')
          v-col(cols='12')
            v-text-field(v-model='banca.transit_code', dense, required, label='Transit Code (CANADA)', counter='5')
      v-btn(color='primary', @click='nextStep') Continua
      v-btn(text, @click='progress--') Annulla
    v-stepper-step(:complete='progress > 7', step='7') Invia i dati
    v-stepper-content(step='7')
      v-btn(:loading='isSubmitting', color='primary', @click='send') Invia tutto
      v-btn(v-if='!isSubmitting', text, @click='progress--') Annulla
  .pa-4
    v-progress-circular(v-if='progress==8', indeterminate, color='primary')

</template>

<script>
import Vue from "vue";
import moment from 'moment'
import { mapState } from "vuex";
export default {
  data() {
    return {
      search_comune: "",
      anagrafica: { ...this.$store.state.aggiungiPersona.anagrafica },
      documento: { ...this.$store.state.aggiungiPersona.documento },
      residenza: { ...this.$store.state.aggiungiPersona.residenza },
      domicilio: { ...this.$store.state.aggiungiPersona.domicilio },
      banca: { ...this.$store.state.aggiungiPersona.banca },
      isSubmitting: false,
      emailRules: [
        v => !!v || "Campo obbligatorio",
        v =>
          /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v) ||
          "Email non valida"
      ],
      phoneRules: [
        v => !!v || "Campo obbligatorio",
        v =>
          // eslint-disable-next-line no-useless-escape
          /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g.test(v) ||
          "Telefono non valido"
      ],
      notNull: [v => !!v || "Campo obbligatorio"],
      codFisRule: [
        v => !!v || "Campo obbligatorio",
        v =>
          /^(?:[A-Z][AEIOU][AEIOUX]|[B-DF-HJ-NP-TV-Z]{2}[A-Z]){2}(?:[\dLMNP-V]{2}(?:[A-EHLMPR-T](?:[04LQ][1-9MNP-V]|[15MR][\dLMNP-V]|[26NS][0-8LMNP-U])|[DHPS][37PT][0L]|[ACELMRT][37PT][01LM]|[AC-EHLMPR-T][26NS][9V])|(?:[02468LNQSU][048LQU]|[13579MPRTV][26NS])B[26NS][9V])(?:[A-MZ][1-9MNP-V][\dLMNP-V]{2}|[A-M][0L](?:[1-9MNP-V][\dLMNP-V]|[0L][1-9MNP-V]))[A-Z]$/i.test(
            v
          ) || "Codice fiscale non valido"
      ],
      numberRule: [
        v => !!v || "Campo obbligatorio",
        v => !isNaN(v) || "Il valore deve essere un numero"
      ],
      validAnagrafica: false,
      validDocumento: false,
      validResidenza: false,
      validDomicilio: false,
      validFacolta: false,
      validBanca: false,
      success: false
    };
  },
  computed: {
    ...mapState("aggiungiPersona", [
      "stati",
      "province",
      "comuni",
      "dipartimenti"
    ]),
    progress: {
      get() {
        return this.$store.state.aggiungiPersona.progress;
      },
      set(v) {
        this.isSubmitting = false;
        this.$store.commit("aggiungiPersona/setProgress", v);
        if (v == 1)
          this.anagrafica = { ...this.$store.state.aggiungiPersona.anagrafica };
        else if (v == 2)
          this.documento = { ...this.$store.state.aggiungiPersona.documento };
        else if (v == 3)
          this.residenza = { ...this.$store.state.aggiungiPersona.residenza };
        else if (v == 4)
          this.domicilio = { ...this.$store.state.aggiungiPersona.domicilio };
        else if (v == 6)
          this.banca = { ...this.$store.state.aggiungiPersona.banca };
      }
    },
    dom_diverso: {
      get() {
        return this.$store.state.aggiungiPersona.dom_diverso;
      },
      set(v) {
        this.$store.commit("aggiungiPersona/setDomDiverso", v);
      }
    },
    facolta: {
      get() {
        return this.$store.state.aggiungiPersona.anagrafica.codice_unitn_dipartimenti;
      },
      set(v) {
        this.$store.commit("aggiungiPersona/setFacolta", v);
      }
    },
    isModifica: {
      get() {
        return this.$store.state.aggiungiPersona.isModifica;
      },
      set(v) {
        this.$store.commit("aggiungiPersona/setModifica", v);
        this.progress = 1;
      }
    },
    persona: {
      get() {
        return this.$store.state.aggiungiPersona.persona;
      },
      set(v) {
        this.$store.commit("aggiungiPersona/setPersona", v);
      }
    }
  },
  created() {
    this.$store.dispatch("aggiungiPersona/loadStati");
    this.$store.dispatch("aggiungiPersona/loadProvince");
    this.$store.dispatch("aggiungiPersona/loadDipartimenti");
  },
  methods: {
    send() {
      this.isSubmitting = true;
      this.$store.dispatch("aggiungiPersona/upload").then(() => {
        this.success = true;
        this.progress = 2;
        this.progress = 1;
        this.$refs.formAnagrafica.resetValidation();
        this.$store.dispatch("aggiungiPersona/loadStati");
        this.$store.dispatch("aggiungiPersona/loadProvince");
        this.$store.dispatch("aggiungiPersona/loadDipartimenti");
        setTimeout(() => {
          this.success = false;
        }, 5000);
      });
    },
    async nextStep() {
      if (this.progress === 1) {
        this.$refs.formAnagrafica.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validAnagrafica) return;
      } else if (this.progress === 2) {
        this.$refs.formDocumento.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validDocumento) return;
      } else if (this.progress === 3) {
        this.$refs.formResidenza.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validResidenza) return;
      } else if (this.progress === 4) {
        this.$refs.formDomicilio.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validDomicilio) return;
      } else if (this.progress === 5) {
        this.$refs.formFacolta.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validFacolta) return;
      } else if (this.progress === 6) {
        this.$refs.formBanca.validate();
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!this.validBanca) return;
      }
      this.progress++;
    }
  },
  watch: {
    anagrafica: {
      handler(val) {
        this.$store.commit("aggiungiPersona/setAnagrafica", { ...val });
      },
      deep: true
    },
    documento: {
      handler(val) {
        this.$store.commit("aggiungiPersona/setDocumento", { ...val });
      },
      deep: true
    },
    residenza: {
      handler(val) {
        this.$store.commit("aggiungiPersona/setResidenza", { ...val });
      },
      deep: true
    },
    domicilio: {
      handler(val) {
        this.$store.commit("aggiungiPersona/setDomicilio", { ...val });
      },
      deep: true
    },
    banca: {
      handler(val) {
        this.$store.commit("aggiungiPersona/setBanca", { ...val });
      },
      deep: true
    },
    search_comune(val) {
      if (val && val.length > 1 && val != this.anagrafica.comune_nascita)
        this.$store.dispatch("aggiungiPersona/searchComune", val);
    },
    persona(val) {
      if (!val) return;
      Vue.prototype.$api.get(`/person/${val.id}/details`).then(
        res => {
          res.data.anagrafica.data_nascita = moment(res.data.anagrafica.data_nascita).format('YYYY-MM-DD')
          res.data.documento.data_rilascio = moment(res.data.documento.data_rilascio).format('YYYY-MM-DD')
          res.data.documento.validita = moment(res.data.documento.validita).format('YYYY-MM-DD')
          this.$store.commit("aggiungiPersona/setComuni", [
            res.data.anagrafica.comune_nascita,
            res.data.residenza.comune,
            res.data.domicilio.comune
          ]);
          this.anagrafica = res.data.anagrafica;
          this.banca = res.data.banca;
          this.residenza = res.data.residenza;
          this.domicilio = res.data.domicilio;
          this.documento = res.data.documento;
        },
        error => {
          console.error(error);
        }
      );
    }
  }
};
</script>
