<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Tipo fabbricato"
            name="tipoFabbricato"
            clearable
            prepend-icon="mdi-office-building"
            :rules="[$validator.requiredText('Tipo fabbricato'), $validator.unique(tipiFabbricatoValues)]"
            v-model="internalValue.tipoFabbricato"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import { TipiFabbricatoCreateBody, TipiFabbricatoReplaceBody } from "operatn-api-client/api/controllers/tipi-fabbricato/index";
import { TipoFabbricato } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoFabbricatoForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: TipiFabbricatoCreateBody | TipiFabbricatoReplaceBody;

  @Prop({ type: Array, default: () => [] })
  tipiFabbricato!: TipoFabbricato[];

  @Prop({ type: Object, required: false })
  backupValue!: TipoFabbricato;

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

  get tipiFabbricatoValues(): string[] {
    const tipi = this.tipiFabbricato.map((t) => t.tipoFabbricato);
    return this.backupValue ? tipi.filter((value) => value !== this.backupValue.tipoFabbricato) : tipi;
  }

  /* METHODS */

  getEmptyValue(): TipiFabbricatoCreateBody | TipiFabbricatoReplaceBody {
    return {
      tipoFabbricato: "",
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