<template lang="pug">
v-container#dettaglio-contratto(v-if='model')
  v-row.mx-2
    v-col.py-0(cols='6')
      v-text-field(label='Cognome', :value='model.cognome', readonly)
    v-col.py-0(cols='6')
      v-text-field(label='Nome', :value='model.nome', readonly)
    v-col.py-0(cols='5')
      v-text-field(prepend-icon='mdi-phone', label='Tel.', :value='model.tel_cellulare', dense, readonly)
    v-col.py-0(cols='7')
      v-text-field(prepend-icon='mdi-at', label='E-mail', :value='model.e_mail', dense, readonly)
    v-col.py-0
      v-text-field(label='Sesso', :value='model.sesso', dense, readonly)
    v-col.py-0
      v-text-field(label='Cittadinanza', :value='model.cittadinanza', dense, readonly)
  v-card.mx-auto(outlined)
    v-card-text
      div Contratto
    v-row.mx-2
      v-col.py-0
        v-text-field(prepend-icon='mdi-calendar-check', label='Inizio', type='date', dense, :value="inizio_contratto && inizio_contratto.toISOString().split('T')[0]", @input='inizio_contratto = $event.target.valueAsDate', readonly)
        v-text-field(prepend-icon='mdi-calendar-remove', type='date', label='Fine', dense, :value="fine_contratto && fine_contratto.toISOString().split('T')[0]", @input='fine_contratto = $event.target.valueAsDate', readonly)
      v-col.py-0
        v-text-field(prepend-icon='mdi-calendar-arrow-left', :value="check_in && check_in.toLocaleString('it-IT')", label='Data check-in', dense, readonly)
        v-text-field(prepend-icon='mdi-calendar-arrow-right', :value="check_out && check_out.toLocaleString('it-IT')", label='Data check-out', dense, readonly)
  v-card.mx-auto.my-3(outlined)
    v-card-text
      div Ubicazione
    v-row.mx-2.my-0.py-0
      v-col.py-0
        v-text-field(prepend-icon='mdi-city', label='Fabbricato', :value='model.descrizione_fabbricato', dense, readonly)
      v-col.py-0
        v-text-field(prepend-icon='mdi-bed', label='Stanza', :value='model.numero_stanza', dense, readonly)
    v-row.mx-2.my-0.py-0
      v-col.py-0
        v-text-field(prepend-icon='mdi-map-marker', label='Indirizzo', :value='model.indirizzo', dense, readonly)
      v-col.py-0(v-if='model.interno != null')
        v-text-field(label='Interno', :value='model.interno', dense, readonly)


</template>


<script>
export default {
  name: "DettaglioContratto",
  props: {
    model: {
      type: Object,
      required: true
    },
    checkin: {
      type: Function,
      required: false
    },
    checkout: {
      type: Function,
      required: false
    }
  },
  computed: {
    inizio_contratto() {
      return new Date(this.model.inizio_contratto);
    },
    fine_contratto() {
      return new Date(this.model.fine_contratto);
    },
    check_in() {
      if (!this.model.check_in) return null;
      return new Date(this.model.check_in);
    },
    check_out() {
      if (!this.model.check_out) return null;
      return new Date(this.model.check_out);
    }
  }
};
</script>