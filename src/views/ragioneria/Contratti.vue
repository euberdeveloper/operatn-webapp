<template lang="pug">
v-card
    v-card-title.headline.font-weight-regular.primary.white--text Ricerca Contratti
    v-row.mx-1
      v-col
        v-select(
          segmented,
          :items="['Modifica Cancella', 'Chiusura Anticipata', 'Proroga', 'Firma ']",
          label="Operazione",
          v-model="operazione"
        )
    v-row 
      v-col
        v-data-table(:items="contratti", :headers="headers_op")
          template(v-slot:item.modifica="{ item }")
            v-icon.mr-2(small="", @click="loadEditContratto(item)") mdi-pencil
            v-icon(small="", v-if="item.ruolo != 3", @click="deleteItem(item)") mdi-delete-forever
          template(v-slot:item.chiusura="{ item }")
            v-icon.mr-2(small="", @click="closeItem(item)") mdi-cancel
          template(v-slot:item.proroga="{ item }")
            v-icon.mr-2(small="", @click="prorogaItem(item)") mdi-update
          template(v-slot:item.firma="{ item }")
            v-icon.mr-2(small="", @click="signItem(item)") mdi-draw
    v-dialog(v-model="dialogContratto", persistent, max-width="800px")
      v-card
        v-card-title.headline.font-weight-regular {{ modifica.proroga ? 'Proroga contratto' : 'Modifica Contratto' }}
          v-btn(text="", style="position: absolute;right: 12pt;")
            v-icon(@click="dismissDialog") mdi-close
        .my-4.mx-6
          v-row
            v-col.p(cols="12")
              dati-contratto(
                v-if="dialogContratto",
                type="modifica",
                v-model="modifica",
                :fabbricati="fabbricati",
                :tipi-contratti="tipiContratti",
                :tipi-utente="tipiUtente",
                :tipi-rate="tipiRate"
              )
    v-alert.ma-2(type="success", v-if="alertSucc") {{ alertSucc }}
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      modifica_orig: null,
      dropdown_icon: [],
    };
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadFabbricati");
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
    this.$store.dispatch("inserimentoContratto/loadTipiRate");
  },
  computed: {
    ...mapState("inserimentoContratto", [
      "fabbricati",
      "tipiContratti",
      "tipiUtente",
      "tipiRate",
      "contratti",
      "dialogContratto",
      "alertSucc",
    ]),
    headers_op() {
      if (this.contratti.length === 0) return [];
      let k = Object.keys(this.contratti[0]).map((x) => {
        return { text: x, value: x };
      });
      k.push({
        text: "",
        value: this.operazione.split(" ")[0].toLowerCase(),
        sortable: false,
      });
      return k;
    },
    operazione: {
      get() {
        return this.$store.state.inserimentoContratto.operazione;
      },
      set(val) {
        this.$store.commit("inserimentoContratto/setOperazione", val);
        this.$store.dispatch("inserimentoContratto/loadContratti");
      },
    },
    nuovo: {
      get() {
        return { ...this.$store.state.inserimentoContratto.nuovo };
      },
      set(val) {
        this.$store.commit("inserimentoContratto/setNuovo", { ...val });
      },
    },
    modifica: {
      get() {
        return { ...this.$store.state.inserimentoContratto.modifica };
      },
      set(val) {
        this.$store.commit("inserimentoContratto/setModifica", { ...val });
      },
    },
    tab: {
      get() {
        return this.$store.state.inserimentoContratto.tab;
      },
      set(v) {
        this.$store.commit("inserimentoContratto/setTab", v);
      },
    },
  },
  methods: {
    ...mapActions("inserimentoContratto", ["loadEditContratto"]),
    deleteItem(item) {
      confirm(
        `Sei sicuro di voler eliminare il contratto di ${item.nome} ${item.cognome} che inizierebbe il ${item.data_inizio} per la stanza ${item.numero_stanza} in ${item.descrizione_fabbricato} con contratto ${item.sigla}`
      ) && this.$store.dispatch("inserimentoContratto/deleteItem", item);
    },
    signItem(item) {
      confirm(
        `Confermi la firma del contratto di ${item.nome} ${item.cognome} che inizia il ${item.data_inizio} per la stanza ${item.numero_stanza} in ${item.descrizione_fabbricato} con contratto ${item.sigla}`
      ) && this.$store.dispatch("inserimentoContratto/signItem", item);
    },
    closeItem(item) {
      confirm(
        `Confermi la chiusura anticipata del contratto di ${item.nome} ${item.cognome} iniziato il il ${item.data_inizio} per la stanza ${item.numero_stanza} in ${item.descrizione_fabbricato} con contratto ${item.sigla}`
      ) && this.$store.dispatch("inserimentoContratto/closeItem", item);
    },
    dismissDialog() {
      this.$store.commit("inserimentoContratto/setDialogContratto", false);
    },
    prorogaItem(item) {
      this.$store.dispatch("inserimentoContratto/loadEditContratto", {
        ...item,
        proroga: true,
      });
    },
  },
};
</script>
<style scoped>
/deep/ .v-textarea textarea[readonly="readonly"] {
  background-color: rgba(240, 240, 240, 0.3);
  color: gray;
}
/deep/ :not(.v-select).v-text-field input[readonly="readonly"] {
  background-color: rgba(240, 240, 240, 0.3);
  color: gray;
}
</style>