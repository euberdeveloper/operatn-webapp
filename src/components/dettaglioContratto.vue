<template>
  <v-container id="dettaglio-contratto" v-if="model">
    <v-row class="mx-2">
      <v-col class="py-0" cols="6">
        <v-text-field label="Cognome" :value="model.cognome" readonly="readonly"></v-text-field>
      </v-col>
      <v-col class="py-0" cols="6">
        <v-text-field label="Nome" :value="model.nome" readonly="readonly"></v-text-field>
      </v-col>
      <v-col class="py-0" cols="5">
        <v-text-field prepend-icon="mdi-phone" label="Tel." :value="model.tel_cellulare" dense="dense" readonly="readonly"></v-text-field>
      </v-col>
      <v-col class="py-0" cols="7">
        <v-text-field prepend-icon="mdi-at" label="E-mail" :value="model.e_mail" dense="dense" readonly="readonly"></v-text-field>
      </v-col>
      <v-col class="py-0">
        <v-text-field label="Sesso" :value="model.sesso" dense="dense" readonly="readonly"></v-text-field>
      </v-col>
      <v-col class="py-0">
        <v-text-field label="Cittadinanza" :value="model.cittadinanza" dense="dense" readonly="readonly"></v-text-field>
      </v-col>
    </v-row>
    <v-card class="mx-auto" outlined="outlined">
      <v-card-text>
        <div>Contratto</div>
      </v-card-text>
      <v-row class="mx-2">
        <v-col class="py-0">
          <v-text-field
            prepend-icon="mdi-calendar-check"
            label="Inizio"
            type="date"
            dense="dense"
            :value="inizio_contratto &amp;&amp; inizio_contratto.toISOString().split('T')[0]"
            @input="inizio_contratto = $event.target.valueAsDate"
            readonly="readonly"
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-calendar-remove"
            type="date"
            label="Fine"
            dense="dense"
            :value="fine_contratto &amp;&amp; fine_contratto.toISOString().split('T')[0]"
            @input="fine_contratto = $event.target.valueAsDate"
            readonly="readonly"
          ></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field
            prepend-icon="mdi-calendar-arrow-left"
            :value="check_in &amp;&amp; check_in.toLocaleString('it-IT')"
            label="Data check-in"
            dense="dense"
            readonly="readonly"
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-calendar-arrow-right"
            :value="check_out &amp;&amp; check_out.toLocaleString('it-IT')"
            label="Data check-out"
            dense="dense"
            readonly="readonly"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card>
    <v-card class="mx-auto my-3" outlined="outlined">
      <v-card-text>
        <div>Ubicazione</div>
      </v-card-text>
      <v-row class="mx-2 my-0 py-0">
        <v-col class="py-0">
          <v-text-field prepend-icon="mdi-city" label="Fabbricato" :value="model.descrizione_fabbricato" dense="dense" readonly="readonly"></v-text-field>
        </v-col>
        <v-col class="py-0">
          <v-text-field prepend-icon="mdi-bed" label="Stanza" :value="model.numero_stanza" dense="dense" readonly="readonly"></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mx-2 my-0 py-0">
        <v-col class="py-0">
          <v-text-field prepend-icon="mdi-map-marker" label="Indirizzo" :value="model.indirizzo" dense="dense" readonly="readonly"></v-text-field>
        </v-col>
        <v-col class="py-0" v-if="model.interno != null">
          <v-text-field label="Interno" :value="model.interno" dense="dense" readonly="readonly"></v-text-field>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>


<script>
export default {
  name: "DettaglioContratto",
  props: {
    model: {
      type: Object,
      required: true,
    },
    checkin: {
      type: Function,
      required: false,
    },
    checkout: {
      type: Function,
      required: false,
    },
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
    },
  },
};
</script>