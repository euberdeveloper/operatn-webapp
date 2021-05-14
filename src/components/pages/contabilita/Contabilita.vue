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
              v-model="formValue.tipoOspite"
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
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";
import OperatnOspiteInput from "@/components/gears/inputs/OperatnOspiteInput.vue";
import OperatnBaseTable, { Actions, Column } from "@/components/gears/bases/OperatnBaseTable.vue";
import { TipoOspite } from "operatn-api-client";

@Component({
  components: {
    OperatnDateInput,
    OperatnOspiteInput,
    OperatnBaseTable,
  },
})
export default class Contabilita extends Mixins(TipoOspiteHandlerMixin) {
  /* DATA */

  private formValid = false;
  private formValue = this.getEmptyBody();
  private loading = {
    xlsx: false,
    tsv: false,
    visulize: false,
  };

  private tipiOspite: { id: number; label: string }[] = [];
  private loadingTipiOspite = false;

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

