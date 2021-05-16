<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-autocomplete
            placeholder="TipoContratto"
            name="idTipoContratto"
            prepend-icon="mdi-note-text-outline"
            :items="tipiContrattoItems"
            item-text="label"
            item-value="value"
            filled
            dense
            clearable
            v-model="internalValue.idTipoContratto"
            :rules="[$validator.requiredText('TipoContratto')]"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedTipoContratto">
        <v-col cols="6">
          <v-text-field type="text" label="Id" name="id" dense hide-details readonly :value="selectedTipoContratto.id" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Sigla" name="sigla" dense hide-details readonly :value="selectedTipoContratto.sigla" />
        </v-col>
      </v-row>
     <v-row align="center" justify="center" v-if="selectedTipoContratto">
        <v-col cols="6">
          <v-text-field type="text" label="Nome" name="nome" dense hide-details readonly :value="selectedTipoContratto.nome" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Tipo studente" name="tipoStudente" dense hide-details readonly :value="selectedTipoContratto.tipoStudente.tipoStudente" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody, TipiContrattoReturned } from "operatn-api-client";

import TipoContrattoHandlerMixin from "@/mixins/handlers/TipoContrattoHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoContratto extends Mixins(TipoContrattoHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private tipiContratto: TipiContrattoReturned[] = [];

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }

  get internalFormValid() {
    return this.formValid;
  }
  set internalFormValid(value) {
    this.$emit("update:formValid", value);
  }

  get tipiContrattoItems() {
    return this.tipiContratto.map(tc => ({
      label: `${tc.sigla} - ${tc.nome}`,
      value: tc.id
    }))
  }

  get selectedTipoContratto(): null | TipiContrattoReturned {
    return this.tipiContratto.find((q) => q.id === this.internalValue.idTipoContratto) ?? null;
  }

  /* LIFE CYCLE */

  async mounted() {
    this.tipiContratto = await this.getTipiContratto({ tipoStudente: true });
  }
}
</script>