<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title Bollette
  v-card-text(style="padding-bottom: 0px; padding-top: 0px;")
    v-subheader.pa-0 Per mostrare tutte le bollette presenti nel sistema lasciare in bianco tutti i campi

  v-expand-transition
    v-main.pa-0(v-if="form")
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
  v-card-text
    v-btn(color="primary", @click="submitCampi") Continua
    v-btn(text, @click="clearCampi") Pulisci campi
    v-btn(text, @click="form = true") Mostra maschera di ricerca
  v-expand-transition
    v-main.pa-0(v-if="submitted")
      v-divider.mb-1
      v-row.mt-2
        v-col
          v-card-title Risultati della ricerca
      v-divider.mb-1
      v-card.ma-1(v-for="i in risultati")
        v-card-title(style="text-transform: capitalize;") Intestatario: {{i.nome}} {{i.cognome}} 
        v-card-subtitle 
          div Contratto valido da {{i.data_inizio}} a {{i.data_fine}}, {{(i.data_firma_contratto == null) ? 'non firmato' : `firmato in data ${i.data_firma_contratto}`}} 
          div {{i.tipo}}, {{(i.contabilizzato == true) ? 'contabilizzato' : `non contabilizzato`}}
          div 
            span.font-weight-bold Cauzione
            span {{(i.cauzione.data_pagamento == null) ? ' non pagata,' : `pagata in data ${i.cauzione.data_pagamento},`}}
            span {{` da restituire in data ${i.cauzione.data_restituzione}`}}
        v-data-table#print.elevation-1(
            :headers="headers",
            dense="",
            :items="i.bollette"
          )
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
        "num_bolletta",
        "scadenza",
        "prezzo",
        "competenza_da",
        "competenza_a",
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
      console.log(params.toString());
      Vue.prototype.$api.get(`/ragioneria/bollette/?${params.toString()}`).then(
        (res) => {
          console.log(res);
          this.risultati = JSON.stringify(res.data);
          this.risultati = JSON.parse(this.risultati);
          this.form = false;
          this.submitted = true;
          let temp = [];
          this.risultati.forEach((element) => {
            let c = temp.findIndex(
              (persona) => persona.id == element.id
            );
            if (c === -1) {
              temp.push({
                id: element.id,
                nome: element.nome,
                cognome: element.cognome,
                data_inizio: element.data_inizio,
                data_fine: element.data_fine,
                contabilizzato: element.contabilizzato,
                data_firma_contratto: element.data_firma_contratto,
                tipo: element.tipo,
                cauzione: {
                  data_pagamento: element.data_pagamento,
                  data_restituzione: element.data_restituzione
                },
                bollette: [{
                  num_bolletta: element.num_bolletta,
                  scadenza: element.scadenza,
                  prezzo: element.prezzo,
                  competenza_da: element.competenza_da,
                  competenza_a: element.competenza_a
                }],
              });
            } else {
              temp[c].bollette.push(
                {
                  num_bolletta: element.num_bolletta,
                  scadenza: element.scadenza,
                  prezzo: element.prezzo,
                  competenza_da: element.competenza_da,
                  competenza_a: element.competenza_a
                });
            }
          });
          this.risultati = temp;
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
        if (value != undefined) this.campi.id_persona = value.id;
      },
    },
  },
};
</script>