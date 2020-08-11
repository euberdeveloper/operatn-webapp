
<template lang="pug">
v-card
  v-card-title.headline.font-weight-regular.primary.white--text Occupazione Stanze
  v-card-text
    v-subheader.pa-0 Qui puoi cercare lo storico di occupazione delle stanze
    v-autocomplete(v-model='studentato', :items='studentati', label='Studentato', prepend-icon='mdi-city')
    v-autocomplete(v-if='studentato', v-model='piano', :items='piani', label='Livello', prepend-icon='mdi-group')
    v-autocomplete(v-if='studentato && piano', v-model='stanza', :items='stanze', label='Stanza', prepend-icon='mdi-door-open')
    v-progress-circular(v-if='loading', indeterminate='', color='primary')
    v-data-table#print.elevation-1(v-if='stanza', :headers='headers', :items='contratti', dense='')
      template(v-slot:item.controls='props')
        v-btn.mx-2(small='', color='primary', @click='dettaglio(props.item)')
          v-icon(dark='') mdi-card-account-mail
  v-dialog(v-if='contratto', v-model='contratto', max-width='600px')
    v-card
      v-card-title
        span.headline Dettagli contratto
        v-button(text='', style='position: absolute;right: 12pt;')
          v-icon(@click='contratto = null') mdi-close
      dettaglio-contratto(:model='contratto')

</template>

<script>
import { mapState } from 'vuex';
  export default {
    computed: {
      ...mapState('stanze', ['studentati','piani','stanze','contratti','loading']),
      headers () {
        let h = ['nome', 'cognome', 'sesso', 'descrizione_fabbricato', 'inizio contratto', 'fine contratto', 'check in', 'check out'].map(x => { return {text: x, value: x } })
        h.push({ text: "", value: "controls", sortable: false })
        return h
			},
			contratto: {
				get() {
					return this.$store.state.stanze.contratto
				},
				set(val) {
					this.$store.commit('stanze/editContratto', val)
				}
      },
      stanza: {
        get() {
					return this.$store.state.stanze.stanza
				},
				set(val) {
          this.$store.commit('stanze/setStanza', val)
          this.$store.dispatch('stanze/loadStanzaHistory', val)
				}
      },
      piano: {
        get() {
					return this.$store.state.stanze.piano
				},
				set(val) {
          this.$store.commit('stanze/setPiano', val)
					this.$store.commit('stanze/setStanza', null)
          this.$store.dispatch('stanze/loadStanze', val)
				}
      },
      studentato: {
        get() {
					return this.$store.state.stanze.studentato
				},
				set(val) {
          this.$store.commit('stanze/setStudentato', val)
					this.$store.commit('stanze/setStanza', null)
					this.$store.commit('stanze/setPiano', null)
          this.$store.dispatch('stanze/loadPiani', val)
				}
      },
    },
    mounted () {
      this.$store.dispatch('stanze/loadStudentati')
    },
    methods: {
      dettaglio (contratto) {
        this.$store.commit('stanze/editContratto', contratto)
      }
    },
  }
</script>