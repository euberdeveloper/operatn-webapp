<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Codice"
            name="codice"
            clearable
            :rules="[$validator.requiredText('Codice'), $validator.unique(contiRicaviCodici), $validator.length(3)]"
            v-model="internalValue.codice"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="number"
            label="Prg"
            name="prg"
            clearable
            :rules="[$validator.requiredText('Prg'), $validator.number()]"
            v-model="internalValue.prg"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Conto ricavi"
            name="conto"
            clearable
            :rules="[$validator.requiredText('Conto ricavi'), $validator.unique(contiRicaviValues)]"
            v-model="internalValue.conto"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Descrizione"
            name="descrizione"
            clearable
            :rules="[$validator.requiredText('Descrizione')]"
            v-model="internalValue.descrizione"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ContiRicaviCreateBody, ContiRicaviReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnContoRicaviForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContiRicaviCreateBody> | Partial<ContiRicaviReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  contiRicaviCodici!: string[];

  @Prop({ type: Array, default: () => [] })
  contiRicaviValues!: string[];

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

  getEmptyValue(): Partial<ContiRicaviCreateBody> | Partial<ContiRicaviReplaceBody> {
    return {
      codice: undefined,
      prg: undefined,
      conto: undefined,
      descrizione: undefined
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