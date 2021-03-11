<template>
  <v-data-table class="elevation-1" :headers="headers" :items="tariffe" :items-per-page="50" dense="dense"
    ><template v-slot:top>
      <v-toolbar flat="flat">
        <v-toolbar-title>Tariffe</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px"
          ><template v-slot:activator="{ on, attrs }">
            <v-btn class="mb-2" color="primary" dark="dark" v-bind="attrs" v-on="on">Aggiungi</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline font-weight-regular">Inserimento tariffa</v-card-title>
            <div class="my-4 mx-6">
              <v-row>
                <v-col class="py-0" cols="12">
                  <input-date-picker label="Valida dal" v-model="nuovaTariffa.dal"></input-date-picker>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Tipo Utente" :items="tipiUtente" item-text="descrizione" item-value="id" v-model="nuovaTariffa.tipoUtente"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Tipo Stanza" :items="tipiStanza" item-text="descrizione" item-value="id" v-model="nuovaTariffa.tipoStanza"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Frequenza Pagamento" :items="frequenze" v-model="nuovaTariffa.frequenza"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete
                    label="Tipo Residenza"
                    :items="tipiResidenza"
                    item-text="descrizione"
                    item-value="id"
                    v-model="nuovaTariffa.tipoResidenza"
                  ></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-text-field label="Prezzo Canone" type="number" v-model.number="nuovaTariffa.prezzoCanone"></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-text-field label="Prezzo Consumi" type="number" v-model.number="nuovaTariffa.prezzoConsumi"></v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="close" text="text" color="primary darken-1">Annulla</v-btn>
              <v-btn @click="submit" text="text" color="primary darken-1">Invia</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template></v-data-table
  >
</template>


<script>
import Vue from "vue";
export default {
  data() {
    return {
      tipiUtente: [],
      tipiResidenza: [],
      tipiStanza: [],
      frequenze: [
        {
          text: "M - Mensile",
          value: "M",
        },
        {
          text: "G - Giornaliera",
          value: "G",
        },
      ],
      tariffe_: [],
      nuovaTariffa: {
        dal: "",
        frequenza: "M",
        tipoUtente: "",
        tipoResidenza: "",
        tipoStanza: "",
        prezzoCanone: 0,
        prezzoConsumi: 0,
      },
      dialog: false,
    };
  },
  computed: {
    headers() {
      if (this.tariffe_.length === 0) return [];
      return Object.keys(this.tariffe_[0]).map((x) => {
        if (x.indexOf("id_") !== -1) x = x.split("_").pop();
        else if (x.indexOf("validita") !== -1) x = x.split("_").pop();
        return { text: x, value: x };
      });
    },
    tariffe() {
      return this.tariffe_.map((x) => {
        let utente = this.tipiUtente.find((y) => y.id === x.id_rag_tipo_utente).descrizione;
        let stanza = this.tipiStanza.find((y) => y.id === x.id_utilizzo_stanza).descrizione;
        let residenza = this.tipiResidenza.find((y) => y.id === x.id_tipo_residenza).descrizione;
        let dal = x.validita_dal ? new Date(x.validita_dal).toLocaleDateString("it-IT") : "";
        let al = x.validita_al ? new Date(x.validita_al).toLocaleDateString("it-IT") : "";
        return {
          ...x,
          utente,
          stanza,
          residenza,
          dal,
          al,
        };
      });
    },
  },
  mounted() {
    Vue.prototype.$api
      .get("/ragioneria/tipi/utente")
      .then(
        (res) => {
          this.tipiUtente = res.data;
        },
        (error) => {
          this.tipiUtente = [];
          console.error(error);
        }
      )
      .then(() =>
        Vue.prototype.$api.get("/ragioneria/tipi/residenza").then(
          (res) => {
            this.tipiResidenza = res.data;
          },
          (error) => {
            this.tipiResidenza = [];
            console.error(error);
          }
        )
      )
      .then(() =>
        Vue.prototype.$api.get("/ragioneria/tipi/stanza").then(
          (res) => {
            this.tipiStanza = res.data;
          },
          (error) => {
            this.tipiStanza = [];
            console.error(error);
          }
        )
      )
      .then(() => this.loadTariffe());
  },
  methods: {
    loadTariffe() {
      Vue.prototype.$api.get("/ragioneria/tariffa").then(
        (res) => {
          this.tariffe_ = res.data;
        },
        (error) => {
          this.tariffe_ = [];
          console.error(error);
        }
      );
    },
    close() {
      this.nuovaTariffa = {
        dal: "",
        frequenza: "M",
        tipoUtente: "",
        tipoResidenza: "",
        tipoStanza: "",
        prezzoCanone: 0,
        prezzoConsumi: 0,
      };
      this.dialog = false;
    },
    submit() {
      Vue.prototype.$api.post("/ragioneria/tariffa", this.nuovaTariffa).then(
        () => {
          this.close();
          this.loadTariffe();
        },
        (error) => {
          console.error(error);
        }
      );
    },
  },
};
</script>