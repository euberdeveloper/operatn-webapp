<template>
  <v-data-table class="elevation-1" :headers="headers" :items="tipi" :items-per-page="50" dense="dense"
    ><template v-slot:top>
      <v-toolbar flat="flat">
        <v-toolbar-title>Tipi Contratto</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px"
          ><template v-slot:activator="{ on, attrs }">
            <v-btn class="mb-2" color="primary" dark="dark" v-bind="attrs" v-on="on">Aggiungi</v-btn>
          </template>
          <v-card>
            <v-card-title class="headline font-weight-regular">Inserimento tipo contratto</v-card-title>
            <v-form class="my-4 mx-6" ref="form" v-model="validForm">
              <v-row>
                <v-col class="py-0" cols="12">
                  <v-text-field label="Descrizione" placeholder="Bando per ...." v-model="descrizione" :rules="notNull"></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-text-field label="Tipo contratto" placeholder="SIGLA" v-model="sigla" :rules="notNull"></v-text-field>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Tipo Studente" :items="tipiStudenti" v-model="tipoStudente" :rules="notNull"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Quietanziante" :items="quietanzianti" v-model="quietanziante" :rules="notNull"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Frequenza" :items="frequenze" v-model="frequenza" :rules="notNull"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Conto di Ricavo Canone" :items="canoni" v-model="canone" :rules="notNull"></v-autocomplete>
                </v-col>
                <v-col class="py-0" cols="12" md="6">
                  <v-autocomplete label="Conto di Ricavo Consumi" :items="consumi" v-model="consumo" :rules="notNull"></v-autocomplete>
                </v-col>
              </v-row>
              <v-card outlined="outlined">
                <v-card-text>Cauzione</v-card-text>
                <v-row>
                  <v-col class="mx-4">
                    <v-autocomplete label="Pagante Cauzione" :items="quietanzianti" v-model="paganteCauzione" :rules="notNull"></v-autocomplete>
                  </v-col>
                </v-row>
              </v-card>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="discard" text="text" color="primary darken-1">Annulla</v-btn>
              <v-btn @click="submit" text="text" color="primary darken-1" :disabled="!validForm">Invia</v-btn>
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
      sigla: "",
      descrizione: "",
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
      frequenza: "M",
      canoni_: [],
      canone: "",
      consumi_: [],
      consumo: "",
      tipiStudenti_: [],
      tipoStudente: "",
      quietanzianti_: [],
      quietanziante: "",
      tipi: [],
      paganteCauzione: "",
      dialog: false,
      notNull: [(v) => !!v || "Campo obbligatorio"],
      numberRule: [(v) => !!v || v === 0 || "Campo obbligatorio", (v) => !isNaN(v) || "Il valore deve essere un numero"],
      validForm: false,
    };
  },
  computed: {
    headers() {
      if (this.tipi.length === 0) return [];
      return Object.keys(this.tipi[0]).map((x) => {
        return { text: x, value: x };
      });
    },
    canoni() {
      return this.canoni_.map((x) => {
        return {
          text: `${x.codice} - ${x.descrizione}`,
          value: x.id,
        };
      });
    },
    consumi() {
      return this.consumi_.map((x) => {
        return {
          text: `${x.codice} - ${x.descrizione}`,
          value: x.id,
        };
      });
    },
    tipiStudenti() {
      return this.tipiStudenti_.map((x) => {
        return {
          text: `${x.descrizione}`,
          value: x.id,
        };
      });
    },
    quietanzianti() {
      return this.quietanzianti_.map((x) => {
        return {
          text: `${x.descrizione}`,
          value: x.id,
        };
      });
    },
  },
  mounted() {
    Vue.prototype.$api.get("/ragioneria/tipi").then(
      (res) => {
        this.tipi = res.data;
      },
      (error) => {
        this.tipi = [];
        console.error(error);
      }
    );
    Vue.prototype.$api.get("/ragioneria/tipi/canoni").then(
      (res) => {
        this.canoni_ = res.data;
      },
      (error) => {
        this.canoni_ = [];
        console.error(error);
      }
    );
    Vue.prototype.$api.get("/ragioneria/tipi/consumi").then(
      (res) => {
        this.consumi_ = res.data;
      },
      (error) => {
        this.consumi_ = [];
        console.error(error);
      }
    );
    Vue.prototype.$api.get("/ragioneria/tipi/studenti").then(
      (res) => {
        this.tipiStudenti_ = res.data;
      },
      (error) => {
        this.tipiStudenti_ = [];
        console.error(error);
      }
    );
    Vue.prototype.$api.get("/ragioneria/tipi/quietanziante").then(
      (res) => {
        this.quietanzianti_ = res.data;
        console.log(this.quietanzianti_);
      },
      (error) => {
        this.quietanzianti_ = [];
        console.error(error);
      }
    );
  },
  methods: {
    discard() {
      this.$refs.form.reset();
      this.dialog = false;
    },
    submit() {
      if (
        this.sigla == "" ||
        this.descrizione == "" ||
        this.frequenza == "" ||
        this.canone == "" ||
        this.consumo == "" ||
        this.quietanziante == "" ||
        this.tipoStudente == ""
      )
        return alert("non hai compilato tutti i campi");
      Vue.prototype.$api
        .post("/ragioneria/tipi", {
          sigla: this.sigla,
          descrizione: this.descrizione,
          frequenza: this.frequenza,
          canone: this.canone,
          consumo: this.consumo,
          quietanziante: this.quietanziante,
          tipoStudente: this.tipoStudente,
          paganteCauzione: this.paganteCauzione,
        })
        .then(
          (res) => {
            this.discard();
            this.tipi.push(res.data[0]);
            alert("Inserimento completato");
          },
          (error) => {
            alert(error);
          }
        );
    },
  },
};
</script>