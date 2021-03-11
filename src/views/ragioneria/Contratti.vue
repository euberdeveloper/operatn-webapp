<template>
  <v-card>
    <v-card-title class="headline font-weight-regular primary white--text">Ricerca Contratti</v-card-title>
    <v-row class="mx-1">
      <v-col>
        <v-select
          segmented="segmented"
          :items="['Modifica / Annulla', 'Da Firmare', 'Firmati', 'Contabilizzati', 'Chiusura Anticipata', 'Proroga']"
          label="Operazione"
          v-model="operazione"
        ></v-select>
      </v-col>
    </v-row>
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
          ><template v-slot:item.da="{ item }">
            <v-icon class="mr-2" small="" @click="dateSign(item)">mdi-draw</v-icon> </template
          ><template v-slot:item.firmati="{ item }">
            <v-icon class="mr-2" small="" @click="cancelSign(item)">mdi-update</v-icon>
          </template></v-data-table
        >
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
            <v-col class="p" cols="12">
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
    <v-alert class="ma-2" type="success" v-if="alertSucc">{{ alertSucc }}</v-alert>
    <v-dialog v-model="dialog" persistent="persistent" max-width="500">
      <v-card>
        <v-main class="pa-0">
          <v-card-title class="headline">Inserisci data {{ desc == 1 ? "di chiusura anticipata" : "di firma" }}</v-card-title>
          <v-row class="mx-3 mt-1">
            <v-col>
              <v-alert type="error" v-if="dataFirmaOk == 0 &amp;&amp; desc == 1"
                >La data di chiusura del contratto deve essere compresa tra la data di inizio e la data di fine contratto</v-alert
              >
              <v-card-text class="pl-0">Seleziona la data in cui il contratto {{ desc == 1 ? "è stato chiuso" : "è stato firmato" }}</v-card-text>
              <input-date-picker v-model="dataFirma" dense="dense" label="Fine" required="required"></input-date-picker>
            </v-col>
          </v-row>
          <v-row class="mx-3 mt-2 pb-3">
            <v-col class="py-0 text-right">
              <v-btn class="ma-1 primary" :disabled="dataFirma == null" @click="confirmCloseItem()">invia</v-btn>
              <v-btn class="ma-1" @click="() =&gt; { dialog = 0; }" text="text">annulla</v-btn>
            </v-col>
          </v-row>
        </v-main>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState, mapActions } from "vuex";
// import moment from 'moment';
export default {
  data() {
    return {
      modifica_orig: null,
      dropdown_icon: [],
      dialog: false,
      data: null,
      dataFirma: null,
      dataFirmaOk: -1,
      desc: 0,
    };
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadFabbricati");
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
    this.$store.dispatch("inserimentoContratto/loadTipiRate");
  },
  computed: {
    ...mapState("inserimentoContratto", ["fabbricati", "tipiContratti", "tipiUtente", "tipiRate", "contratti", "dialogContratto", "alertSucc"]),
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
    dateSign(item) {
      this.data = item;
      this.dialog = true;
      this.desc = 2;
    },
    closeItem(item) {
      this.data = item;
      this.dialog = true;
      this.desc = 1;
      // confirm(
      //   `Confermi la chiusura anticipata del contratto di ${item.nome} ${item.cognome} iniziato il il ${item.data_inizio} per la stanza ${item.numero_stanza} in ${item.descrizione_fabbricato} con contratto ${item.sigla}`
      // ) && this.$store.dispatch("inserimentoContratto/closeItem", item);
    },
    cancelSign(item) {
      console.log(item);
      confirm(
        `Sei sicuro di voler eliminare la firma dal contratto di ${item.nome} ${item.cognome} per la stanza ${item.numero_stanza} in ${item.descrizione_fabbricato} con contratto ${item.sigla}`
      ) && this.$store.dispatch("inserimentoContratto/cancelSignContract", item);
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
    confirmCloseItem() {
      if ((new Date(this.dataFirma) > new Date(this.data.data_inizio) && new Date(this.dataFirma) < new Date(this.data.data_fine)) || this.desc == 2) {
        this.dataFirmaOk = 1;
        this.data.data_firma = JSON.parse(JSON.stringify(this.dataFirma));
        if (this.desc == 1) {
          this.$store.dispatch("inserimentoContratto/closeItem", this.data);
        } else if (this.desc == 2) {
          this.$store.dispatch("inserimentoContratto/dateSign", this.data);
        }
        this.dialog = false;
        this.data = null;
        this.dataFirma = null;
        this.dataFirmaOk = -1;
      } else this.dataFirmaOk = 0;
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