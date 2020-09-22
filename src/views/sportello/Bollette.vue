<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title Bollette
  v-card-text(style="padding-bottom: 0px; padding-top: 0px;")
    v-subheader.pa-0 Per mostrare tutte le bollette presenti nel sistema lasciare in bianco tutti i campi

  v-expand-transition
    v-content.pa-0(v-if="form")
      v-row.mx-2.mt-2
        v-col.py-0
          v-text-field(
            v-model="campi.id_contratto",
            dense,
            required,
            :rules="[(value) => !isNaN(value) || 'Inserire il codice identificativo del contratto']",
            label="Id contratto"
          )
        v-col.py-0
          v-text-field(
            v-model="campi.num_bolletta",
            dense,
            required,
            :rules="[(value) => !isNaN(value) || 'Inserire il codice identificativo della bolletta']",
            label="Numero di bolletta"
          )
      v-row.mx-2.mt-2
        v-col.py-0
          user-select(
            return-object,
            hide-no-data,
            dense,
            prepend-icon="mdi-account",
            v-model="campi.persona"
          )
        v-col.py-0
          v-text-field(
            v-model="campi.id_persona",
            dense,
            required,
            :rules="[(value) => !isNaN(value) || 'Inserire il codice identificativo della persona', (value) => value != 'Inserire il codice identificativo della persona']",
            label="Id persona"
          )
      v-row.mx-2.mt-2
        v-col.py-0
          v-card-text Seleziona l'intervallo di date in cui il contratto è iniziato
          v-date-picker.elevation-1(
            v-model="campi.dates_start",
            :landscape="$vuetify.breakpoint.mdAndUp",
            range="",
            show-current="",
            first-day-of-week="1",
            locale="it-it",
            hint="MM/DD/YYYY format"
          )
        v-col.py-0
          v-card-text Seleziona l'intervallo di date in cui il contratto è finito
          v-date-picker.elevation-1(
            v-model="campi.dates_end",
            :landscape="$vuetify.breakpoint.mdAndUp",
            range="",
            show-current="",
            first-day-of-week="1",
            locale="it-it",
            hint="MM/DD/YYYY format"
          )
        v-col.py-0
          v-card-text Seleziona l'intervallo di date in cui il contratto è stato registrato
          v-date-picker.elevation-1(
            v-model="campi.reg_dates",
            :landscape="$vuetify.breakpoint.mdAndUp",
            range="",
            show-current="",
            first-day-of-week="1",
            locale="it-it",
            hint="MM/DD/YYYY format"
          )
      v-row.mx-2.mt-2
        v-col.py-0
          v-select(
            :items="tipiContratti",
            item-text="desc_sigla",
            item-value="id",
            label="Tipo di contratto",
            v-model="campi.tipo_contratto"
          )
        v-col.py-0
          v-select(
            :items="tipiUtente",
            label="Tipo di utente",
            item-text="descrizione",
            item-value="id",
            v-model="campi.tipo_utente"
          )
        v-col.py-0
          v-select(
            :items="anniAccademici",
            label="Anno contratto",
            v-model="campi.anno_contratto"
          )
  v-expand-transition
    v-content.pa-0(v-if="submitted")
      v-divider.mb-2
      v-row.mt-2
        v-col
          v-card-title Risultati della ricerca
      v-divider.mb-1
      v-row.mt-2
        v-col.ma-1
          v-data-table#print.elevation-1(
            :headers="headers",
            dense="",
            :items="risultati"
          )
  v-card-text
    v-btn(color="primary", @click="submitCampi") Continua
    v-btn(text, @click="clearCampi") Pulisci campi
    v-btn(text, @click="form = true") Mostra maschera di ricerca
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
// import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      error: false,
      evoluto: null,
      bollette: null,
      radios: null,
      id_contratto: null,
      expand: [false, false, false],
      submitted: false,
      dates: null,
      campi: {
        id_contratto: null,
        num_bolletta: null,
        id_persona: null,
        persona: null,
        dates_start: null,
        dates_end: null,
        reg_dates: null,
        tipo_contratto: null,
        tipo_utente: null,
        anno_contratto: null,
      },
      risultati: null,
      form: true,
    };
  },
  computed: {
    headers() {
      let h = [
        "nome",
        "cognome",
        "data_inizio",
        "data_fine",
        "contabilizzato",
        "data_firma_contratto",
        "num_bolletta",
        "scadenza",
        "prezzo",
        "competenza_da",
        "competenza_a",
        "tipo",
      ].map((x) => {
        return { text: x, value: x };
      });
      return h;
    },
    anniAccademici() {
      return [...Array(new Date().getFullYear() - 2015 + 5).keys()].map((x) => {
        return `${2015 + x}/${2015 + x + 1}`;
      });
    },
    ...mapState("inserimentoContratto", ["tipiContratti", "tipiUtente"]),
  },
  methods: {
    submitCampi() {
      let params = new URLSearchParams(this.campi);
      console.log(params.toString())
      Vue.prototype.$api.get(`/ragioneria/bollette/?${params.toString()}`).then(
        (res) => {
          console.log(res);
          this.risultati = JSON.stringify(res.data);
          this.risultati = JSON.parse(this.risultati);
          this.form = false;
          this.submitted = true;
          console.log(res.data);
        },
        (error) => {
          console.log(error);
        }
      );
    },
    clearCampi() {
      this.submitted = false;
      this.form = true;
      let setAll = (obj) => Object.keys(obj).forEach((i) => (obj[i] = null));
      setAll(this.campi, null);
    },
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
  },
  watch: {
    "campi.persona": {
      handler(value) {
        if(value != undefined)
        this.campi.id_persona = value.id;
      }
    }
  }
};
</script>