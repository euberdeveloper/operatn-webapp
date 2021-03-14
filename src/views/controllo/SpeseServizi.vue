<template>
<v-card>
  v-card-title class="headline font-weight-regular primary white--text" Spese Servizi
  <v-main class="pa-0">
    <v-row class="mx-2 mt-2">
      <v-col class="py-0">
        v-text-field dense="dense" required="required" :rules="[(value) =&gt; !isNaN(value) || 'Inserire il codice identificativo del contratto']" label="Id contratto" 
      </v-col>
    </v-row>
    <v-row class="mx-2 mt-2">
      <v-col class="py-0">
        user-select return-object hide-no-data="hide-no-data" dense="dense" prepend-icon="mdi-account" v-model="campi.persona" 
      </v-col>
      <v-col class="py-0">
        v-text-field v-model="campi.id_persona" dense="dense" required="required" :rules="[(value) =&gt; !isNaN(value) || 'Inserire il codice identificativo della persona', (value) =&gt; value != 'Inserire il codice identificativo della persona']" label="Id persona" 
      </v-col>
    </v-row>
    <v-card-text>
      v-btn color="primary" @click="submitCampi" Continua
      v-btn text="text" @click="clearCampi" Pulisci campi
    </v-card-text>
    <v-expand-transition>
      <v-main class="pa-0" v-if="submitted">
        v-divider class="mb-1" 
        <v-row class="mt-2">
          <v-col>
            v-card-title {{ ricerca ? 'Risultati di ricerca' : 'Nessun risultato trovato' }}
          </v-col>
          v-col class="mr-2 text-right" v-if="ricerca" 
        </v-row>
        v-divider class="mb-1" 
        <v-card class="ma-1" v-for="(i, index) of risultati" :key="index">
          <v-card-title style="text-transform: capitalize;">Intestatario: {{ i.nome }} {{ i.cognome }}
            <v-col class="text-right">
              v-btn color="primary" @click="openDialog(i)" Aggiungi Spesa
            </v-col>
          </v-card-title>
          <v-card-subtitle>
            div Contratto valido da {{ i.data_inizio }} a {{ i.data_fine }}, {{ i.data_firma_contratto == null ? 'non firmato' : `firmato in data ${i.data_firma_contratto}` }}, {{ i.contabilizzato == null ? `non contabilizzato` : `contabilizzato in data ${i.contabilizzato}`}}
            div Stanza: {{ i.numero_stanza }} - Indirizzo {{ i.indirizzo }}
          </v-card-subtitle>
          v-data-table class="elevation-1" id="print" :headers="headers" dense="" :items="i.bollette" 
        </v-card>
      </v-main>
    </v-expand-transition>
  </v-main>
  <v-dialog v-model="dialog" persistent="persistent" max-width="800">
    <v-card>
      <v-main class="pa-0">
        v-card-title class="headline" Inserisci Spesa
        <v-row class="mx-3 mt-1">
          <v-col>
            v-card-text class="pl-0" Seleziona il servizio da erogare
            v-select :items="items" label="Servizio da aggiungere" v-model="servizio" :item-value="(item) =&gt; item.id" :item-text="(item) =&gt; item.descrizione" return-object 
          </v-col>
        </v-row>
        <v-row class="mx-3 mt-1">
          <v-col>
            v-card-text class="pl-0" Seleziona la data in cui il servizio è stato erogato
            input-date-picker v-model="data" dense="dense" label="Fine" required="required" 
          </v-col>
          <v-col>
            v-card-text class="pl-0" Seleziona la scadenza di pagamento per il servizio
            input-date-picker v-model="scadenza" dense="dense" label="Fine" required="required" 
          </v-col>
        </v-row>
        <v-card class="ma-4" outlined="outlined" v-if="line != null">
          v-card-title Riepilogo
          v-card-subtitle v-html="line" 
          v-alert class="mx-3" dense="dense" type="success" v-if="ok != null" {{ ok }}
        </v-card>
        <v-row class="mx-3 mt-2 pb-3">
          <v-col class="py-0 text-right">
            v-btn class="ma-1 primary" :disabled="line == null" @click="addSpesa" invia
            v-btn class="ma-1" @click="() =&gt; { (dialog = false), (servizio.id = null), (data = null), (scadenza = null); }" text="text" annulla
          </v-col>
        </v-row>
      </v-main>
    </v-card>
  </v-dialog>
</v-card>
</template>

<script>
// import { mapState, mapActions } from 'vuex'
import Vue from "vue";
export default {
  data() {
    return {
      submitted: false,
      risultati: null,
      ricerca: false,
      dialog: false,
      campi: {
        id_contratto: null,
        persona: null,
        id_persona: null,
      },
      servizio: {
        id: null,
        descrizione: null,
        prezzo: null,
      },
      data: null,
      scadenza: null,
      contratto: null,
      items: [],
      ok: null,
    };
  },
  computed: {
    headers() {
      let h = ["num_bolletta", "scadenza", "prezzo", "competenza_da", "competenza_a", "tipo"].map((x) => {
        return { text: x, value: x };
      });
      return h;
    },
    line() {
      if (this.servizio.id != null && this.data != null && this.scadenza != null)
        return `Verrà registrata una spesa di <span class="font-weight-medium">${this.servizio.prezzo}</span>€ per il servizio <span class="font-weight-medium">${
          this.servizio.descrizione
        }</span> 
                erogato in data <span class="font-weight-medium">${this.GetFormattedDate(
                  new Date(this.data)
                )}</span> e con scadenza <span class="font-weight-medium">${this.GetFormattedDate(new Date(this.scadenza))}</span> 
                per il contratto intestato a <span class="font-weight-medium">${
                  this.contratto.nome + " " + this.contratto.cognome
                }</span>, attivo per la stanza <span class="font-weight-medium">${this.contratto.numero_stanza}</span>
                 nell'alloggo in <span class="font-weight-medium">${this.contratto.indirizzo}</span>.`;
      else return null;
    },
  },
  methods: {
    submitCampi() {
      let params = new URLSearchParams(this.campi);
      console.log(params.toString());
      Vue.prototype.$api.get(`/ragioneria/spese-contratto/?${params.toString()}`).then(
        (res) => {
          this.risultati = JSON.stringify(res.data);
          this.risultati = JSON.parse(this.risultati);
          this.form = false;
          this.submitted = true;
          let temp = [];
          if (this.risultati[0] == undefined) this.ricerca = false;
          else
            this.risultati.forEach((element) => {
              let c = temp.findIndex((persona) => persona.id == element.id);
              if (c === -1) {
                this.ricerca = true;
                temp.push({
                  id: element.id,
                  nome: element.nome,
                  cognome: element.cognome,
                  data_inizio: element.data_inizio,
                  data_fine: element.data_fine,
                  contabilizzato: element.contabilizzato,
                  data_firma_contratto: element.data_firma_contratto,
                  indirizzo: element.indirizzo,
                  numero_stanza: element.numero_stanza,
                  cauzione: {
                    data_pagamento: element.data_pagamento,
                    data_restituzione: element.data_restituzione,
                  },
                  bollette: [
                    {
                      num_bolletta: element.num_bolletta,
                      scadenza: element.scadenza,
                      prezzo: element.prezzo,
                      competenza_da: element.competenza_da,
                      competenza_a: element.competenza_a,
                      tipo: element.tipo,
                    },
                  ],
                });
              } else {
                temp[c].bollette.push({
                  num_bolletta: element.num_bolletta,
                  scadenza: element.scadenza,
                  prezzo: element.prezzo,
                  competenza_da: element.competenza_da,
                  competenza_a: element.competenza_a,
                  tipo: element.tipo,
                });
              }
            });
          console.log(temp);
          this.risultati = temp;
        },
        (error) => {
          console.log(error);
        }
      );
    },
    clearCampi() {
      this.submitted = false;
      this.form = true;
      let setAll = (obj) => Object.keys(obj).forEach((i) => (obj[i] = null));
      setAll(this.campi, null);
    },
    addSpesa() {
      Vue.prototype.$api
        .post(`/ragioneria/spese-contratto`, {
          id_contratto: this.contratto.id,
          tipo: this.servizio.id,
          data: this.data,
          scadenza: this.scadenza,
        })
        .then(() => {
          this.ok = `Inserimento eseguito con successo.`;
          setTimeout(() => {
            this.ok = null;
            this.dialog = null;
            this.submitCampi();
          }, 2000);
        });
    },
    openDialog(contratto) {
      this.contratto = contratto;
      this.dialog = true;
      Vue.prototype.$api.get("/ragioneria/tipi/servizi").then((res) => {
        this.items = res.data;
      });
    },
    GetFormattedDate(date) {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var year = date.getFullYear();
      return month + "/" + day + "/" + year;
    },
  },
  watch: {
    "campi.persona": {
      handler(value) {
        if (value != undefined) this.campi.id_persona = value.id;
      },
    },
  },
};
</script>