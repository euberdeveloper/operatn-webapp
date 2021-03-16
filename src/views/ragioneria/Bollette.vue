<template>
<v-card>
    <v-toolbar class="primary elevation-0" dark="dark">
        <v-toolbar-title>Bollette</v-toolbar-title>
    </v-toolbar>
    <v-card-text style="padding-bottom: 0px; padding-top: 0px;">
        <v-subheader class="pa-0">Per mostrare tutte le bollette presenti nel sistema lasciare in bianco tutti i campi</v-subheader>
    </v-card-text>
    <v-expand-transition>
        <v-main class="pa-0" v-if="form">
            <v-row class="mx-2 mt-2">
                <v-col class="py-0">
                    <v-text-field v-model="campi.id_contratto" dense="dense" required="required" :rules="[(value) =&gt; !isNaN(value) || 'Inserire il codice identificativo del contratto']" label="Id contratto"></v-text-field>
                </v-col>
                <v-col class="py-0">
                    <v-text-field v-model="campi.num_bolletta" dense="dense" required="required" :rules="[(value) =&gt; !isNaN(value) || 'Inserire il codice identificativo della bolletta']" label="Numero di bolletta"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mx-2 mt-2">
                <v-col class="py-0">
                    <user-select return-object hide-no-data="hide-no-data" dense="dense" prepend-icon="mdi-account" v-model="campi.persona"></user-select>
                </v-col>
                <v-col class="py-0">
                    <v-text-field v-model="campi.id_persona" dense="dense" required="required" :rules="[(value) =&gt; !isNaN(value) || 'Inserire il codice identificativo della persona', (value) =&gt; value != 'Inserire il codice identificativo della persona']" label="Id persona"></v-text-field>
                </v-col>
            </v-row>
            <v-row class="mx-2 mt-2">
                <v-col class="py-0 text-center">
                    <v-card-text>Seleziona l'intervallo di date in cui il contratto è iniziato</v-card-text>
                    <v-date-picker class="elevation-1" v-model="campi.dates_start" range="" show-current="" first-day-of-week="1" locale="it-it" hint="MM/DD/YYYY format"></v-date-picker>
                </v-col>
                <v-col class="py-0 text-center">
                    <v-card-text>Seleziona l'intervallo di date in cui il contratto è finito</v-card-text>
                    <v-date-picker class="elevation-1" v-model="campi.dates_end" range="" show-current="" first-day-of-week="1" locale="it-it" hint="MM/DD/YYYY format"></v-date-picker>
                </v-col>
                <v-col class="py-0 text-center">
                    <v-card-text>Seleziona l'intervallo di date in cui il contratto è stato registrato</v-card-text>
                    <v-date-picker class="elevation-1" v-model="campi.reg_dates" range="" show-current="" first-day-of-week="1" locale="it-it" hint="MM/DD/YYYY format"></v-date-picker>
                </v-col>
            </v-row>
            <v-row class="mx-2 mt-2">
                <v-col class="py-0">
                    <v-select :items="tipiContratti" item-text="desc_sigla" item-value="id" label="Tipo di contratto" v-model="campi.tipo_contratto"></v-select>
                </v-col>
                <v-col class="py-0">
                    <v-select :items="tipiUtente" label="Tipo di utente" item-text="descrizione" item-value="id" v-model="campi.tipo_utente"></v-select>
                </v-col>
                <v-col class="py-0">
                    <v-select :items="anniAccademici" label="Anno contratto" v-model="campi.anno_contratto"></v-select>
                </v-col>
            </v-row>
        </v-main>
    </v-expand-transition>
    <v-card-text>
        <v-btn color="primary" @click="submitCampi">Continua</v-btn>
        <v-btn text="text" @click="clearCampi">Pulisci campi</v-btn>
        <v-btn text="text" @click="form = true">Mostra maschera di ricerca</v-btn>
    </v-card-text>
    <v-expand-transition>
        <v-main class="pa-0" v-if="submitted">
            <v-divider class="mb-1"></v-divider>
            <v-row class="mt-2">
                <v-col>
                    <v-card-title>{{ (ricerca) ? 'Risultati di ricerca' : 'Nessun risultato trovato' }}</v-card-title>
                </v-col>
                <v-col class="mr-2 text-right" v-if="ricerca"><a :href="esportaCSV" download="bollette.csv" style="text-decoration: none;">
                        <v-btn text="text">Esporta in CSV</v-btn>
                    </a>
                    <v-btn text="text" @click="esportaPDF">Esporta in PDF</v-btn>
                </v-col>
            </v-row>
            <v-divider class="mb-1"></v-divider>
            <v-card class="ma-1">
                <v-card-title style="text-transform: capitalize;">Intestatario: {{ risultati.nome }} {{ risultati.cognome }}</v-card-title>
                <v-card-subtitle>
                    <div>Contratto valido da {{ risultati.data_inizio }} a {{ risultati.data_fine }}<!--, {{ i.data_firma_contratto ? 'non firmato' : `firmato in data ${i.data_firma_contratto}` }}, {{ i.contabilizzato ? `non contabilizzato` : `contabilizzato in data ${i.contabilizzato}`}} --></div>
                </v-card-subtitle>
                <v-data-table class="elevation-1" id="print" :headers="headers" dense="" :items="risultati.bollette"></v-data-table>
            </v-card>
        </v-main>
    </v-expand-transition>
</v-card>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
const pdfMake = require("pdfmake/build/pdfmake.js");
//import XLSX from "xlsx";
/*
-------------------- CAUZIONE ---------------------
div 
  span.font-weight-bold Cauzione
  span {{ i.cauzione.data_pagamento == null ? ' non pagata,' : `pagata in data ${i.cauzione.data_pagamento},` }}
  span {{ ` da restituire in data ${i.cauzione.data_restituzione}` }}
*/
export default {
  data() {
    return {
      error: false,
      evoluto: null,
      bollette: null,
      radios: null,
      id_contratto: null,
      expand: [false, false, false],
      submitted: false,
      dates: null,
      campi: {
        id_contratto: null,
        num_bolletta: null,
        id_persona: null,
        persona: null,
        dates_start: null,
        dates_end: null,
        reg_dates: null,
        tipo_contratto: null,
        tipo_utente: null,
        anno_contratto: null,
      },
      risultati: null,
      form: true,
      ricerca: false,
      risultati_raw: null,
    };
  },
  computed: {
    esportaCSV() {
      return '';
      // let value = JSON.parse(JSON.stringify(this.risultati_raw));
      // let a = XLSX.utils.json_to_sheet(value);
      // let b = XLSX.utils.sheet_to_csv(a);
      // return `data:application/octet-stream,${b.toString()}`;
    },
    headers() {
      let h = ["numero", "scadenza", "prezzo_canoni", "prezzo_consumi", "prezzo_totale", "competenza_dal", "competenza_al", "tipo"].map((x) => {
        return { text: x, value: x };
      });
      return h;
    },
    anniAccademici() {
      return [...Array(new Date().getFullYear() - 2015 + 5).keys()].map((x) => {
        return `${2015 + x}/${2015 + x + 1}`;
      });
    },
    ...mapState("inserimentoContratto", ["tipiContratti", "tipiUtente"]),
  },
  methods: {
    purgeResult(bollette) {
      const b = bollette.map(b => ({
        numero: b.numero,
        scadenza: new Date(b.dataScadenza)?.toLocaleDateString('it'),
        prezzo_canoni: b.importoCanoni,
        prezzo_consumi: b.importoConsumi,
        prezzo_totale: b.importoTotale,
        competenza_dal: new Date(b.competenzaDal)?.toLocaleDateString('it'),
        competenza_al: new Date(b.competenzaAl)?.toLocaleDateString('it'),
        tipo: b.tipoBolletta.tipoBolletta
      }))
      return {
        data_inizio: new Date(bollette?.[0]?.contratto?.dataInizio)?.toLocaleDateString('it'),
        data_fine: new Date(bollette?.[0]?.contratto?.dataFine)?.toLocaleDateString('it'),
        nome: bollette?.[0]?.contratto?.contrattiSuOspite?.[0]?.ospite?.persona?.nome,
        cognome: bollette?.[0]?.contratto?.contrattiSuOspite?.[0]?.ospite?.persona?.cognome,
        bollette: b
      };
    },
    async submitCampi() {
      if (!this.campi.id_contratto) alert('selezionare id contratto')

      try {
        const result = await Vue.prototype.$api.get(`/contratti/${this.campi.id_contratto}/bollette?contratto=true&tipoBolletta=true&contratto.contrattiSuOspite=true&contratto.contrattiSuOspite.ospite=true&contratto.contrattiSuOspite.ospite.persona=true`);
        const purged = this.purgeResult(result.data);
        this.risultati = purged;
         this.ricerca = purged.bollette.length > 0;
         console.log(this.ricerca)
        this.form = false;
        this.submitted = true;
      }
      catch(error) {
        console.error(error)
        alert('Errore generico');
      }
      // let params = new URLSearchParams(this.campi);
      // console.log(params.toString());
      // Vue.prototype.$api.get(`/contratto/bollette/?${params.toString()}`).then(
      //   (res) => {
      //     this.risultati = JSON.stringify(res.data);
      //     this.risultati = JSON.parse(this.risultati);
      //     this.form = false;
      //     this.submitted = true;
      //     let temp = [];
      //     if (this.risultati[0] == undefined) this.ricerca = false;
      //     else
      //       this.risultati.forEach((element) => {
      //         let c = temp.findIndex((persona) => persona.id == element.id);
      //         if (c === -1) {
      //           this.ricerca = true;
      //           temp.push({
      //             id: element.id,
      //             nome: element.nome,
      //             cognome: element.cognome,
      //             data_inizio: element.data_inizio,
      //             data_fine: element.data_fine,
      //             contabilizzato: element.contabilizzato,
      //             data_firma_contratto: element.data_firma_contratto,
      //             cauzione: {
      //               data_pagamento: element.data_pagamento,
      //               data_restituzione: element.data_restituzione,
      //             },
      //             bollette: [
      //               {
      //                 num_bolletta: element.num_bolletta,
      //                 scadenza: element.scadenza,
      //                 prezzo: element.prezzo,
      //                 competenza_da: element.competenza_da,
      //                 competenza_a: element.competenza_a,
      //                 tipo: element.tipo,
      //               },
      //             ],
      //           });
      //         } else {
      //           temp[c].bollette.push({
      //             num_bolletta: element.num_bolletta,
      //             scadenza: element.scadenza,
      //             prezzo: element.prezzo,
      //             competenza_da: element.competenza_da,
      //             competenza_a: element.competenza_a,
      //             tipo: element.tipo,
      //           });
      //         }
      //       });
      //     this.risultati_raw = JSON.parse(JSON.stringify(this.risultati));
      //     this.risultati = temp;
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    },
    clearCampi() {
      this.submitted = false;
      this.form = true;
      let setAll = (obj) => Object.keys(obj).forEach((i) => (obj[i] = null));
      setAll(this.campi, null);
    },
    esportaPDF() {
      let value = JSON.parse(JSON.stringify(this.risultati));
      let docDefinition = {
        content: [
          {
            text: "Report Bollette - Portineria Opera Universitaria Trento",
            fontSize: 20,
            margin: [0, 20],
          },
        ],
      };
      value.map((element, i) => {
        let v = value[i];
        v.bollette = element.bollette.map((e) => {
          return Object.values(e);
        });
        let h = this.headers.map((e) => {
          return e.text;
        });
        v.bollette.splice(0, 0, h);
        v.table = {
          layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            body: v.bollette,
          },
          defaultStyle: {
            fontSize: 15,
            alignment: "center",
          },
        };
        v.header = {
          text: [
            { text: `Contratto intestato a: ${v.nome} ${v.cognome}\n`, fontSize: 16 },
            {
              text: `Valido da ${v.data_inizio} a ${v.data_fine}, ${v.data_firma_contratto == null ? "non firmato" : `firmato in data ${v.data_firma_contratto}`}
            ${v.contabilizzato == null ? `non contabilizzato` : `contabilizzato in data ${v.contabilizzato}`}`,
            },
          ],
        };
        docDefinition.content.push(v.header);
        docDefinition.content.push(v.table);
        return v;
      });
      pdfMake.createPdf(docDefinition).open();
    },
  },
  mounted() {
    this.$store.dispatch("inserimentoContratto/loadTipiUtente");
    this.$store.dispatch("inserimentoContratto/loadTipiContratti");
    if (pdfMake.vfs == undefined) {
      let pdfFonts = require("pdfmake/build/vfs_fonts.js");
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
    }
  },
  watch: {
    "campi.persona": {
      handler(value) {
        if (value != undefined) this.campi.id_persona = value.id;
      },
    },
  },
};
/*
------------- CAUZIONE PDF -------------
Cauzione ${ v.cauzione.data_pagamento == null ? " non pagata," : `pagata in data ${v.cauzione.data_pagamento},`}${` da restituire in data ${v.cauzione.data_restituzione}`}`}],
*/
</script>