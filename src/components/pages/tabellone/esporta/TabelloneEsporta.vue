<template>
  <v-card flat class="pb-8 pl-2">
    <v-card-text>Specifica le date di inizio e di fine dei contratti per vederne o scaricarne il tabellone</v-card-text>
    <v-form v-model="formValid" @submit.prevent>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="4">
            <operatn-date-input label="Data inizio" name="dataInizio" :rules="[$validator.requiredText('Data inizio')]" v-model="formValue.dataInizio" />
          </v-col>
          <v-col cols="4">
            <operatn-date-input label="Data fine" name="dataFine" :rules="[$validator.requiredText('Data fine')]" v-model="formValue.dataFine" />
          </v-col>
          <v-col cols="4">
            <!-- TSV -->
            <v-btn class="ma-2" :loading="loading.tsv" :disabled="isDisabled" color="success" @click="fetchTsv">
              <v-icon left dark>mdi-file-table</v-icon>
              <span>TSV</span>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>

            <!-- XLSX -->
            <v-btn class="ma-2" :loading="loading.xlsx" :disabled="isDisabled" color="success" @click="fetchXlsx">
              <v-icon left dark>mdi-google-spreadsheet</v-icon>
              <span>XLSX</span>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>

            <!-- VISUALIZE -->
            <v-btn class="ma-2" :loading="loading.visualize" :disabled="isDisabled" color="primary" @click="visualize">
              <v-icon dark>mdi-eye</v-icon>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" v-if="tabellone.length">
          <v-col cols="12">
            <operatn-base-table title="Tabellone" :columns="columns" :values="tabellone" multiSort :elevation="5" />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Tabellone, TabelloneQueryParams } from "operatn-api-client";

import TabelloneHandlerMixin from "@/mixins/handlers/TabelloneHandlerMixin";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";
import { downloadBlob } from "@/utils";
import OperatnBaseTable, { Column } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnDateInput,
    OperatnBaseTable
  },
})
export default class TabelloneEsporta extends Mixins(TabelloneHandlerMixin) {
  /* DATA */

  private formValid = false;
  private formValue = this.getEmptyBody();
  private loading = {
    xlsx: false,
    tsv: false,
    visulize: false,
  };

  private tabellone: Tabellone[] = [];
  private columns: Column<Tabellone>[] = [
    {
      text: "Fabbricato",
      value: "fabbricatoCodice",
      groupable: true,
      editable: false,
    },
    {
      text: "Unità immobiliare",
      value: "stanzaUnitaImmobiliare",
      groupable: true,
      editable: false,
    },
    {
      text: "Numero stanza",
      value: "stanzaNumeroStanza",
      groupable: true,
      editable: false,
    },
    {
      text: "Tipo stanza",
      value: "tipoStanzaTipoStanza",
      groupable: true,
      editable: false,
    },
    {
      text: "Piano",
      value: "stanzaPiano",
      groupable: true,
      editable: false,
    },
    {
      text: "Posto letto",
      value: "postoLettoPostoLetto",
      groupable: false,
      editable: false,
    },
    {
      text: "Manutenzione",
      value: "manutenzioneDataCreazione",
      groupable: false,
      editable: false,
    },
    {
      text: "Nome",
      value: "personaNome",
      groupable: false,
      editable: false,
    },
    {
      text: "Cognome",
      value: "personaCognome",
      groupable: false,
      editable: false,
    },
    {
      text: "Cittadinanza",
      value: "ospiteCittadinanza",
      groupable: true,
      editable: false,
    },
    {
      text: "Dipartimento",
      value: "dipartimentoUnitnCodice",
      groupable: true,
      editable: false,
    },
    {
      text: "Inizio contratto",
      value: "contrattoDataInizio",
      groupable: false,
      editable: false,
    },
    {
      text: "Fine contratto",
      value: "contrattoDataFine",
      groupable: false,
      editable: false,
    },
    {
      text: "Tipo contratto",
      value: "tipoContrattoSigla",
      groupable: true,
      editable: false,
    },
    {
      text: "Tipo ospite",
      value: "tipoOspiteSigla",
      groupable: true,
      editable: false,
    },
  ];

  /* GETTERS */

  get queryParams(): TabelloneQueryParams {
    return { startDate: this.formValue.dataInizio as Date, endDate: this.formValue.dataFine as Date };
  }

  get isDisabled(): boolean {
    return !this.formValid || Object.keys(this.loading).some((k) => this.loading[k]);
  }


  /* METHODS */

  getEmptyBody() {
    return {
      dataInizio: null as Date | null,
      dataFine: null as Date | null,
    };
  }

  getFileName(extension: string) {
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "_");
    return `tabellone__${timestamp}.${extension}`;
  }

  async fetchTsv(): Promise<void> {
    if (!this.isDisabled) {
      try {
        this.loading.tsv = true;
        const blob = await this.getTabelloneTsv(this.queryParams);
        downloadBlob(blob, this.getFileName("tsv"));
      } finally {
        this.loading.tsv = false;
      }
    }
  }
  async fetchXlsx(): Promise<void> {
    if (!this.isDisabled) {
      try {
        this.loading.xlsx = true;
        const blob = await this.getTabelloneXlsx(this.queryParams);
        downloadBlob(blob, this.getFileName("xlsx"));
      } finally {
        this.loading.xlsx = false;
      }
    }
  }
  async visualize(): Promise<void> {
    if (!this.isDisabled) {
      try {
        this.loading.visulize = true;
        this.tabellone = await this.getTabellone(this.queryParams);
      } finally {
        this.loading.visulize = false;
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

