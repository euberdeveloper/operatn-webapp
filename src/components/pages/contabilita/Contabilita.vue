<template>
  <v-card>
    <v-toolbar flat color="primary">
      <v-toolbar-title class="headline primary white--text">Contabilità</v-toolbar-title>
    </v-toolbar>
    <v-card-subtitle>Qui puoi contabilizzare le bollette</v-card-subtitle>
    <v-form v-model="formValid" @submit.prevent class="ma-8">
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <operatn-date-input label="Inizio scadenza" name="scadenzaInizio" :rules="[$validator.requiredText('Inizio scadenza')]" v-model="formValue.scadenzaInizio" />
          </v-col>
          <v-col cols="4">
            <operatn-date-input label="Fine scadenza" name="scadenzaFine" :rules="[$validator.requiredText('Fine scadenza')]" v-model="formValue.scadenzaFine" />
          </v-col>
          <v-col cols="4">
            <v-autocomplete v-model="formValue.siglaCausale" label="Sigla causale" name="siglaCausale" clearable :items="$store.state.sigleCausali" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-autocomplete
              v-model="formValue.idTipoOspite"
              label="Tipo ospite"
              name="tipoOspite"
              clearable
              :items="tipiOspite"
              item-text="label"
              item-value="id"
              :loading="loadingTipiOspite"
            />
          </v-col>
          <v-col cols="4">
            <operatn-ospite-input label="Ospite" name="idOspite" v-model="formValue.idOspite" />
          </v-col>
          <v-col cols="4">
            <v-btn class="ma-2" :loading="loading" :disabled="isDisabled" color="primary" @click="fetchBollette">
              <v-icon left dark>mdi-eye</v-icon>
              <span>VISUALIZZA</span>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>

             <v-btn class="ma-2" :loading="loading" :disabled="isDisabledCarica" color="warning" @click="uploadBollette">
              <v-icon left dark>mdi-upload</v-icon>
              <span>CARICA</span>
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-data-table v-if="bollette.length" :headers="headers" :items="handledBollette" item-key="id" :options.sync="tableOptions" :loading="loadingBollette" :server-items-length="totalBollette">
      <template v-slot:item.importoCanoni="{ value }"> € {{ value ? value : 0 }} </template>
      <template v-slot:item.importoConsumi="{ value }"> € {{ value ? value : 0 }} </template>
      <template v-slot:item.importoTotale="{ value }"> € {{ value }} </template>
      <template v-slot:item.competenzaDal="{ value }"> {{ value.toLocaleDateString() }} </template>
      <template v-slot:item.competenzaAl="{ value }"> {{ value.toLocaleDateString() }} </template>
      <template v-slot:item.dataScadenza="{ value }"> {{ value.toLocaleDateString() }} </template>
      <template v-slot:item.stato="{ value }">
        <v-icon color="primary" v-if="value === null">mdi-arrow-collapse-up</v-icon>
        <v-icon color="success" v-else-if="value === true">mdi-check</v-icon>
        <v-icon color="error" v-else>mdi-close</v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { ActionTypes, AlertType } from "@/store";
import { DataOptions, DataTableHeader } from "vuetify";

import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";
import ContabilitaHandlerMixin from "@/mixins/handlers/ContabilitaHandlerMixin";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";
import OperatnOspiteInput from "@/components/gears/inputs/OperatnOspiteInput.vue";
import { ContabilitaBollettaInfo, ContabilitaError, ContabilitaPageParams, ContabilitaQueryParams, TipoOspite } from "operatn-api-client";

@Component({
  components: {
    OperatnDateInput,
    OperatnOspiteInput,
  },
})
export default class Contabilita extends Mixins(TipoOspiteHandlerMixin, ContabilitaHandlerMixin) {
  /* DATA */

  private formValid = false;
  private formValue = this.getEmptyBody();
  private loading = false;

  private tipiOspite: { id: number; label: string }[] = [];
  private loadingTipiOspite = false;

  private bollette: ContabilitaBollettaInfo[] = [];
  private totalBollette = 0;
  private success: number[] = [];
  private failed: number[] = [];
  private loadingBollette = false;
  private headers: DataTableHeader[] = [
    {
      text: "ID",
      value: "id",
    },
    {
      text: "Causale",
      value: "siglaCausale",
    },
    {
      text: "Canoni",
      value: "importoCanoni",
    },
    {
      text: "Consumi",
      value: "importoConsumi",
    },
    {
      text: "Totale",
      value: "importoTotale",
    },
    {
      text: "Competenza dal",
      value: "competenzaDal",
    },
    {
      text: "Competenza al",
      value: "competenzaAl",
    },
    {
      text: "Scadenza",
      value: "dataScadenza",
    },
    {
      text: "Tipo bolletta",
      value: "tipoBolletta.tipoBolletta",
    },
    {
      text: "Ospite",
      value: "ospite.persona.codiceFiscale",
    },
    {
      text: "Stato",
      value: "stato",
    },
  ];
  private tableOptions: DataOptions = {
    page: 1,
    itemsPerPage: 15,
    sortBy: [],
    sortDesc: [],
    groupBy: [],
    groupDesc: [],
    multiSort: false,
    mustSort: false
  }

  /* GETTERS */

  get isDisabled(): boolean {
    return !this.formValid || this.loading;
  }
  get isDisabledCarica(): boolean {
    return this.isDisabled || !this.bollette.length;
  }

  get queryParams(): ContabilitaQueryParams & ContabilitaPageParams {
    return {
      startDate: this.formValue.scadenzaInizio as Date,
      endDate: this.formValue.scadenzaFine as Date,
      idTipoOspite: this.formValue.idTipoOspite ?? undefined,
      idOspite: this.formValue.idOspite ?? undefined,
      siglaCausale: this.formValue.siglaCausale ?? undefined,
      page: this.tableOptions.itemsPerPage > 0 ? this.tableOptions.page : undefined,
      pageSize: this.tableOptions.itemsPerPage > 0 ? this.tableOptions.itemsPerPage : undefined
    };
  }

  get handledBollette() {
    return this.bollette.map((b) => ({
      ...b,
      stato: this.success.indexOf(b.id) !== -1 ? true : this.failed.indexOf(b.id) !== -1 ? false : null,
    }));
  }

  /* METHODS */

  getEmptyBody() {
    return {
      scadenzaInizio: null as Date | null,
      scadenzaFine: null as Date | null,
      idOspite: null as number | null,
      idTipoOspite: null as number | null,
      siglaCausale: null as string | null,
    };
  }

  parseTipiOspite(tipiOspite: TipoOspite[]) {
    return tipiOspite.map((tipoOspite) => ({
      id: tipoOspite.id,
      label: `${tipoOspite.sigla} - ${tipoOspite.tipoOspite}`,
    }));
  }

  async fetchBollette(): Promise<void> {
    if (!this.isDisabled) {
      try {
        this.loading = true;
        this.loadingBollette = true;
        this.totalBollette = await this.getContabilitaBolletteCount(this.queryParams);
        this.bollette = await this.getContabilitaBollette(this.queryParams);
      } finally {
        this.loading = false;
        this.loadingBollette = false;
      }
    }
  }

  async uploadBollette(): Promise<void> {
    if (!this.isDisabledCarica) {
      try {
        this.loading = true;
        this.success = await this.sendContabilitaBollette(this.queryParams);
      } 
      catch (error) {
        if (error instanceof ContabilitaError) {
          const nSuccessed = error.passedBollette.length;
          const nFailed = error.failedBollette.length;
          this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nell'inviare bollette, ${nSuccessed} inviate, ${nFailed} fallite`, alertType: AlertType.ERROR_ALERT });

          this.success.push(...error.passedBollette);
          this.failed = error.failedBollette;
        }
      }
      finally {
        this.loading = false;
      }
    }
  }

  /* WATCH */

  @Watch("formValue", { deep: true })
  watchFormValue() {
    this.bollette = [];
  }

  @Watch("tableOptions", { deep: true })
  watchTableOptions() {
    this.fetchBollette();
  }

  /* LIFE CYCE */

  async mounted() {
    try {
      this.loadingTipiOspite = true;
      const tipiOspite = await this.getTipiOspite();
      this.tipiOspite = this.parseTipiOspite(tipiOspite);
    } finally {
      this.loadingTipiOspite = false;
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

