<template>
  <v-card>
    <v-card-title class="headline font-weight-regular primary white--text">Inserimento contratto</v-card-title>
    <v-expand-transition>
      <v-tabs dark="dark" background-color="primary" v-model="tab">
        <v-tab> <v-icon dense="dense" left="left">mdi-plus</v-icon>Nuovo </v-tab>
        <v-tab-item>
          <dati-contratto
            type="nuovo"
            v-model="nuovo"
            :fabbricati="fabbricati"
            :quietanzianti="quietanzianti"
            :tipi-contratti="tipiContratti"
            :tipi-utente="tipiUtente"
            :tariffe="tariffe"
            :tipi-tariffa="tipiTariffa"
            :utilizzi-stanza="utilizziStanza"
            :tipi-rate="tipiRate"
          ></dati-contratto>
        </v-tab-item>
        <v-tab-item>
          <v-row>
            <v-col>
              <v-data-table :items="contratti" :headers="headers_op"
                ><template v-slot:item.modifica="{ item }">
                  <v-icon class="mr-2" small="" @click="loadEditContratto(item)">mdi-pencil</v-icon>
                  <v-icon small="" v-if="item.ruolo != 3" @click="deleteItem(item)">mdi-delete-forever</v-icon> </template
                ><template v-slot:item.chiusura="{ item }">
                  <v-icon class="mr-2" small="" @click="closeItem(item)">mdi-cancel</v-icon> </template
                ><template v-slot:item.proroga="{ item }">
                  <v-icon class="mr-2" small="" @click="prorogaItem(item)">mdi-update</v-icon> </template
                ><template v-slot:item.firma="{ item }">
                  <v-icon class="mr-2" small="" @click="signItem(item)">mdi-draw</v-icon>
                </template></v-data-table>
            </v-col>
          </v-row>
          <v-dialog v-model="dialogContratto" persistent="persistent" max-width="800px">
            <v-card>
              <v-card-title class="headline font-weight-regular"
                >{{ modifica.proroga ? "Proroga contratto" : "Modifica Contratto" }}
                <v-btn text="" style="position: absolute; right: 12pt">
                  <v-icon @click="dismissDialog">mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <div class="my-4 mx-6">
                <v-row>
                  <v-col class="py-0" cols="12">
                    <dati-contratto
                      v-if="dialogContratto"
                      type="modifica"
                      v-model="modifica"
                      :fabbricati="fabbricati"
                      :tipi-contratti="tipiContratti"
                      :tipi-utente="tipiUtente"
                      :tipi-rate="tipiRate"
                    ></dati-contratto>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-dialog>
        </v-tab-item>
      </v-tabs>
    </v-expand-transition>
    <v-alert class="ma-2" type="success" v-if="alertSucc">{{ alertSucc }}</v-alert>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      modifica_orig: null,
      dropdown_icon: [],
      tipiRate: ['MENSILE', 'UNICA', 'DA_BANDO']
    };
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadFabbricati");
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
    this.$store.dispatch("inserimentoContratto/loadQuietanzianti");
    this.$store.dispatch("inserimentoContratto/loadTariffe");
    this.$store.dispatch("inserimentoContratto/loadUtilizziStanza");
    this.$store.dispatch("inserimentoContratto/loadTipiTariffa");

  },
  computed: {
    ...mapState("inserimentoContratto", ["fabbricati", "utilizziStanza", "tipiContratti", "tipiTariffa", "tariffe", "quietanzianti", "tipiUtente", "contratti", "dialogContratto", "alertSucc"]),
    headers_op() {
      if (this.contratti.length === 0) return [];
      let k = Object.keys(this.contratti[0]).map((x) => {
        return { text: x, value: x };
      });
      k.push({ text: "", value: this.operazione.split(" ")[0].toLowerCase(), sortable: false });
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
::v-deep .v-textarea textarea[readonly="readonly"] {
  background-color: rgba(240, 240, 240, 0.3);
  color: gray;
}
::v-deep :not(.v-select).v-text-field input[readonly="readonly"] {
  background-color: rgba(240, 240, 240, 0.3);
  color: gray;
}
</style>