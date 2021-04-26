<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Tipo studente"
            name="tipoStudente"
            clearable
            prepend-icon="mdi-home-group"
            :rules="[$validator.requiredText('Tipo studente'), $validator.unique(tipiStudenteValues)]"
            v-model="internalValue.tipoStudente"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import { TipiStudenteCreateBody, TipiStudenteReplaceBody } from "operatn-api-client/api/controllers/tipi-studente/index";
import { TipoStudente } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoStudenteForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: TipiStudenteCreateBody | TipiStudenteReplaceBody;

  @Prop({ type: Array, default: () => [] })
  tipiStudente!: TipoStudente[];

  @Prop({ type: Object, required: false })
  backupValue!: TipoStudente;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

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

  get tipiStudenteValues(): string[] {
    const tipi = this.tipiStudente.map((t) => t.tipoStudente);
    return this.backupValue ? tipi.filter((value) => value !== this.backupValue.tipoStudente) : tipi;
  }

  /* METHODS */

  getEmptyValue(): TipiStudenteCreateBody | TipiStudenteReplaceBody {
    return {
      tipoStudente: "",
    };
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value === null) {
      this.internalValue = this.getEmptyValue();
    }
  }
}
</script>