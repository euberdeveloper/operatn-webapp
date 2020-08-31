<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title Bollette
  v-card-text(style="padding-bottom: 0px; padding-top: 0px;")
    v-subheader.pa-0 Ricerca per id contratto/nome, data di inizio o per data di scadenza
  v-card-text
    v-radio-group(v-model="radios", :mandatory="true")
      v-radio(value="idcontratto", label="Id contratto")
      v-radio(
        value="datainizio",
        label="Contratti che iniziano nel periodo (da selezionare)"
      )
      v-radio(
        value="datascadenza",
        label="Contratti che terminano nel periodo (da selezionare)"
      )
      v-radio(value="evoluto", label="Ricerca avanzata") 
    v-expand-transition
      v-form.mb-2(v-show="expand[0]")
        v-text-field(
          v-model="campi[0].id_contratto",
          dense,
          required,
          :rules="[value => !isNaN(value) || 'Inserire il codice identificativo del contratto']"
          label="Id contratto"
        )
    v-expand-transition
      v-form.mb-2(v-show="expand[1]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text(v-if="!error") Seleziona l'intervallo di date
            v-card-text(v-else, style="color: red") {{error}}
            v-date-picker.elevation-1(
              v-model="campi[1].dates",
              :landscape="$vuetify.breakpoint.mdAndUp",
              range="",
              show-current="",
              first-day-of-week="1",
              locale="it-it",
              hint="MM/DD/YYYY format"
            )
    v-expand-transition
      v-form.mb-2(v-show="expand[2]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text(v-if="!error") Seleziona l'intervallo di date
            v-card-text(v-else, style="color: red") {{error}}
            v-date-picker.elevation-1(
              v-model="campi[2].dates",
              :landscape="$vuetify.breakpoint.mdAndUp",
              range="",
              show-current="",
              first-day-of-week="1",
              locale="it-it",
              hint="MM/DD/YYYY format"
            )
    v-expand-transition
      v-form.mb-2(v-show="expand[3]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text Seleziona l'intervallo di date in cui il contratto è stato registrato
            v-date-picker.elevation-1(
              v-model="campi[3].reg_dates",
              :landscape="$vuetify.breakpoint.mdAndUp",
              range="",
              show-current="",
              first-day-of-week="1",
              locale="it-it",
              hint="MM/DD/YYYY format"
            )
          v-col.py-0
            v-card-text Seleziona l'intervallo di date in cui il contratto è iniziato
            v-date-picker.elevation-1(
              v-model="campi[3].inizio_dates",
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
              item-value="id"
              label="Tipo di contratto",
              v-model="campi[3].tipo_contratto"
            )
          v-col.py-0
            v-select(
              :items="tipiUtente",
              label="Tipo di utente",
              item-text="descrizione",
              item-value="id"
              v-model="campi[3].tipo_utente"
            )
          v-col.py-0
            v-select(
              :items="anniAccademici",
              label="Anno contratto",
              v-model="campi[3].anno_contratto"
            )
    v-expand-transition
      v-data-table#print.elevation-1(
        v-show="submitted",
        :headers="headers",
        dense=""
      )
        template(v-slot:item.controls="props")
          v-btn.mx-2(small="", color="primary", @click="dettaglio(props.item)")
            v-icon(dark="") mdi-card-account-mail
    v-card-text 
      v-btn(color="primary", @click="submitCampi") Continua
      v-btn(text, @click="clearCampi") Pulisci campi
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
      campi: [
        { id_contratto: null },
        { dates: null },
        { dates: null },
        {
          reg_dates: null,
          inizio_dates: null,
          tipo_contratto: null,
          tipo_utente: null,
          anno_contratto: null,
        },
      ],
    };
  },
  watch: {
    radios() {
      this.error = false;
      this.expand = this.expand.map((x) => {
        x = false;
        return x;
      });
      switch (this.radios) {
        case "idcontratto":
          this.expand[0] = true;
          break;
        case "datainizio":
          this.expand[1] = true;
          break;
        case "datascadenza":
          this.expand[2] = true;
          break;
        case "evoluto":
          this.expand[3] = true;
          break;
      }
    },
  },
  computed: {
    headers() {
      let h = [
        "nome",
        "cognome",
        "sesso",
        "descrizione_fabbricato",
        "inizio contratto",
        "fine contratto",
        "check in",
        "check out",
      ].map((x) => {
        return { text: x, value: x };
      });
      h.push({ text: "", value: "controls", sortable: false });
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
      this.expand.forEach((value, i) => {
        if (value) {
          let params = new URLSearchParams(this.campi[i]);
          console.log(this.tipiUtente)
          switch (i) {
            case 1:
            case 2:
              if (this.campi[i].dates.length > 1) {
                this.error = false;
                break;
              }
              this.error = `Il campo deve essere un intervallo di date`;
              return;
            default:
              break;
          }
          Vue.prototype.$api
            .get(`/ragioneria/bollette/${i}?${params.toString()}`)
            .then(
              () => {
                this.submitted = true;
              },
              (error) => {
                console.log(error);
              }
            );
        }
      });
    },
    clearCampi() {
      this.submitted = false;
      this.error = false;
      let setAll = (obj)=> Object.keys(obj).forEach(k => {
        Object.keys(obj[k]).forEach(i => obj[k][i] = null);
      });
      setAll(this.campi, null);
    },
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
  },
};
</script>