<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Codice"
            name="codice"
            clearable
            prepend-icon="mdi-barcode"
            :rules="[$validator.requiredText('Codice'), $validator.unique(contiRicaviConsumiCodici)]"
            v-model="internalValue.codice"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Conto ricavi e consumi"
            name="contoRicaviConsumi"
            clearable
            prepend-icon="mdi-circle-multiple"
            :rules="[$validator.requiredText('Conto ricavi e consumi'), $validator.unique(contiRicaviConsumiValues)]"
            v-model="internalValue.contoRicaviConsumi"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { ContiRicaviConsumiCreateBody, ContiRicaviConsumiReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnContoRicaviConsumiForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: ContiRicaviConsumiCreateBody | ContiRicaviConsumiReplaceBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  contiRicaviConsumiCodici!: string[];

  @Prop({ type: Array, default: () => [] })
  contiRicaviConsumiValues!: string[];

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

  getEmptyValue(): ContiRicaviConsumiCreateBody | ContiRicaviConsumiReplaceBody {
    return {
      codice: '',
      contoRicaviConsumi: "",
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