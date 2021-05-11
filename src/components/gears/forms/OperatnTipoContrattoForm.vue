<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
         <v-col cols="12">
          <v-text-field
            type="text"
            label="Sigla"
            name="sigla"
            clearable
            :rules="[$validator.requiredText('Sigla'), $validator.unique(tipiContrattoSigle)]"
            v-model="internalValue.sigla"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Nome"
            name="nome"
            clearable
            :rules="[$validator.requiredText('Nome'), $validator.unique(tipiContrattoValues)]"
            v-model="internalValue.nome"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-select
            type="text"
            label="Tipo studente"
            name="idTipoStudente"
            clearable
            :items="tipiStudente"
            item-text="tipoStudente"
            item-value="id"
            :rules="[$validator.requiredText('Tipo studente')]"
            v-model="internalValue.idTipoStudente"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { TipoStudente, TipiContrattoCreateBody, TipiContrattoReplaceBody } from "operatn-api-client";

import TipoStudenteHandlerMixin from "@/mixins/handlers/TipoStudenteHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoContrattoForm extends Mixins(TipoStudenteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<TipiContrattoCreateBody> | Partial<TipiContrattoReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  tipiContrattoSigle!: string[];

  @Prop({ type: Array, default: () => [] })
  tipiContrattoValues!: string[];

  /* DATA */

  private tipiStudente: TipoStudente[] = [];

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

  /* METHODS */

  getEmptyValue(): Partial<TipiContrattoCreateBody> | Partial<TipiContrattoReplaceBody> {
    return {
      sigla: undefined,
      nome: undefined,
      tipoStudente: undefined
    };
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value === null) {
      this.internalValue = this.getEmptyValue();
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    this.tipiStudente = await this.getTipiStudente();
  }
}
</script>