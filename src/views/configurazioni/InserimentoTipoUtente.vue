<template>
  <v-data-table class="elevation-1" :headers="headers" :items="tipiUtenti_" items-per-page="50" dense=""
    ><template v-slot:top="">
      <v-toolbar flat="">
        <v-toolbar-title>Tipi Utenti</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px"
          ><template v-slot:activator="{ on, attrs }">
            <v-btn class="mb-2" color="primary" dark="" v-bind="attrs" v-on="on">Aggiungi</v-btn>
          </template>
          <v-card>
            <v-card-title><span class="headline">Nuovo Utente</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="nuovoTipo.sigla" label="Sigla"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="nuovoTipo.descrizione" label="Descrizione"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text="" @click="dialog = false">Annulla</v-btn>
              <v-btn color="blue darken-1" text="" @click="submit">Salva</v-btn>
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
      tipiUtenti_: [],
      headers: ["id", "sigla", "descrizione"].map((x) => {
        return { text: x, value: x };
      }),
      dialog: false,
      nuovoTipo: {
        sigla: "",
        descrizione: "",
      },
    };
  },
  computed: {
    tipiUtenti() {
      return this.tipiUtenti_;
    },
  },
  mounted() {
    Vue.prototype.$api.get("/ragioneria/tipi/utente").then(
      (res) => {
        this.tipiUtenti_ = res.data;
      },
      (error) => {
        this.tipiUtenti_ = [];
        console.error(error);
      }
    );
  },
  methods: {
    submit() {
      Vue.prototype.$api.post("/ragioneria/tipi/utente", this.nuovoTipo).then(
        (res) => {
          this.tipiUtenti_.push(res.data[0]);
          this.nuovoTipo = {
            sigla: "",
            descrizione: "",
          };
          this.dialog = false;
        },
        (error) => {
          console.error(error);
        }
      );
    },
  },
};
</script>