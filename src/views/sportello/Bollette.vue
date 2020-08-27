<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title Bollette
  v-card-text(style="padding-bottom: 0px; padding-top: 0px;")
    v-subheader.pa-0  Ricerca per id contratto/nome, data di inizio o per data di scadenza
  v-card-text
    v-radio-group(v-model="radios" :mandatory="true")
      v-radio(value="idcontratto" label="Id contratto o nome")
      v-radio(value="datainizio" label="Contratti che iniziano nel periodo (da selezionare)")
      v-radio(value="datascadenza" label="Contratti che terminano nel periodo (da selezionare)")
      v-radio(value="evoluto" label="Ricerca personalizzata")  
    v-expand-transition
      v-form.mb-2(v-show="expand[0]")
        v-text-field(v-model='id_contratto', dense, required, label='Id contratto o nome')
    v-expand-transition
      v-form.mb-2(v-show="expand[1]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text Seleziona l'intervallo di date
            v-date-picker.elevation-1(v-model="dates" :landscape='$vuetify.breakpoint.mdAndUp', range='', show-current='', first-day-of-week='1', locale='it-it')
    v-expand-transition
      v-form.mb-2(v-show="expand[2]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text Seleziona l'intervallo di date
            v-date-picker.elevation-1(v-model="dates" :landscape='$vuetify.breakpoint.mdAndUp', range='', show-current='', first-day-of-week='1', locale='it-it')
    v-expand-transition
      v-form.mb-2(v-show="expand[3]")
        v-row.mx-2.mt-2
          v-col.py-0
            v-card-text Seleziona l'intervallo di date in cui il contratto è stato registrato
            v-date-picker.elevation-1(v-model="dates" :landscape='$vuetify.breakpoint.mdAndUp', range='', show-current='', first-day-of-week='1', locale='it-it')
          v-col.py-0
            v-card-text Seleziona l'intervallo di date in cui il contratto è iniziato
            v-date-picker.elevation-1(v-model="dates" :landscape='$vuetify.breakpoint.mdAndUp', range='', show-current='', first-day-of-week='1', locale='it-it')
        v-row.mx-2.mt-2
          v-col.py-0
            v-select(:items="items" label="Tipo di contratto")
          v-col.py-0
            v-select(:items="items" label="Tipo di utente")
          v-col.py-0
            v-select(:items="items" label="Anno contratto")
    v-expand-transition
      v-data-table#print.elevation-1(v-show="submitted" :headers='headers', :items='contratti', dense='')
        template(v-slot:item.controls='props')
          v-btn.mx-2(small='', color='primary', @click='dettaglio(props.item)')
            v-icon(dark='') mdi-card-account-mail
    v-card-text  
      v-btn(color='primary', @click='submitCampi') Continua
      v-btn(text, @click='clearCampi') Pulisci campi
    

</template>

<script>
	// import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            evoluto: null,
            bollette: null,
            radios: null,
            id_contratto: null,
            expand: [false, false, false],
            submitted: false,
            dates: null
        }
    },
    watch: {
      radios() {
        this.expand = this.expand.map(x => {
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
      }
    },
    computed: {
      headers() {
        let h = ['nome', 'cognome', 'sesso', 'descrizione_fabbricato', 'inizio contratto', 'fine contratto', 'check in', 'check out'].map(x => { return {text: x, value: x } })
        h.push({ text: "", value: "controls", sortable: false })
        return h
      }
    },
    methods: {
      submitCampi() {
        this.submitted = true;

      },
      clearCampi() {
        this.submitted = false;
      }
    }

  //   computed: {
	// 		...mapState('alloggi',[]),
	// 	},
		
	// 	methods: {
	// 		...mapActions('alloggi', []),
	// 	},
}
</script>