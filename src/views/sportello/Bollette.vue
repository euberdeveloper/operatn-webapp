<template lang="pug">
v-card
  v-toolbar.primary.elevation-0(dark)
    v-toolbar-title Bollette
  v-card-text(style="padding-bottom: 0px; padding-top: 0px;")
    v-subheader.pa-0 Ricerca per id contratto/nome, data di inizio o per data di scadenza
  v-card-text
    v-radio-group(v-model="radios" :mandatory="true")
      v-radio(value="idcontratto" label="Id contratto o nome")
      v-radio(value="datainizio" label="Data di inizio")
      v-radio(value="datascadenza" label="Data di scadenza")
    v-expand-transition
      v-form.mb-2(v-show="expand[0]")
        v-text-field(v-model='id_contratto', dense, required, label='Id contratto o nome')
    v-expand-transition
      v-form.mb-2(v-show="expand[1]")
        v-row.mx-2.mt-2
          v-col
            input-date-picker(
                  dense,
                  label="Dal",
                  required
                )
          v-col
            input-date-picker(
                  dense,
                  label="Al",
                  required
                )
    v-expand-transition
      v-form.mb-2(v-show="expand[2]")
        v-row.mx-2.mt-2
          v-col
            input-date-picker(
                  dense,
                  label="Dal",
                  required
                )
          v-col
            input-date-picker(
                  dense,
                  label="Al",
                  required
                )
    v-data-table#print.elevation-1(:headers='headers', :items='contratti', dense='')
      template(v-slot:item.controls='props')
        v-btn.mx-2(small='', color='primary', @click='dettaglio(props.item)')
          v-icon(dark='') mdi-card-account-mail
    v-card-text
      v-checkbox(v-model="evoluto" label="Evoluto")
      v-row.mx-2.mt-2
          v-col
            input-date-picker(
                  dense,
                  label="Dal",
                  required
                )
          v-col
            input-date-picker(
                  dense,
                  label="Al",
                  required
                )
      v-row.mx-2.mt-2
          v-col
            v-select(:items="items" label="Tipo di contratto")
          v-col
            v-select(:items="items" label="Tipo di utente")
      v-row.mx-2.mt-2
          v-col
            v-select(:items="items" label="Anno contratto")
          v-col
            input-date-picker(
                  dense,
                  label="Dal",
                  required
                )
            input-date-picker(
                  dense,
                  label="Al",
                  required
                )
    v-card-text  
      v-btn(color='primary', @click='') Continua
      v-btn(text, @click='') Pulisci campi
    

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
            expand: [false, false, false]
        }
    },
    watch: {
      radios() {
        this.expand = [false, false, false];
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
        }
      }
    },
    computed: {
      headers() {
        let h = ['nome', 'cognome', 'sesso', 'descrizione_fabbricato', 'inizio contratto', 'fine contratto', 'check in', 'check out'].map(x => { return {text: x, value: x } })
        h.push({ text: "", value: "controls", sortable: false })
        return h
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