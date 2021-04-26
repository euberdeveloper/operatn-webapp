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
            :rules="[$validator.requiredText('Codice'), $validator.unique(contiRicaviCanoniCodici)]"
            v-model="internalValue.codice"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Conto ricavi e canoni"
            name="contoRicaviCanoni"
            clearable
            prepend-icon="mdi-circle-multiple-outline"
            :rules="[$validator.requiredText('Conto ricavi e canoni'), $validator.unique(contiRicaviCanoniValues)]"
            v-model="internalValue.contoRicaviCanoni"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

import { ContiRicaviCanoniCreateBody, ContiRicaviCanoniReplaceBody } from "operatn-api-client/api/controllers/conti-ricavi-canoni/index";
import { ContoRicaviCanoni } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnContoRicaviCanoniForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: ContiRicaviCanoniCreateBody | ContiRicaviCanoniReplaceBody;

  @Prop({ type: Array, default: () => [] })
  contiRicaviCanoni!: ContoRicaviCanoni[];

  @Prop({ type: Object, required: false })
  backupValue!: ContoRicaviCanoni;

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

  get contiRicaviCanoniCodici(): string[] {
    const codici = this.contiRicaviCanoni.map((q) => q.codice);
    return this.backupValue ? codici.filter((value) => value !== this.backupValue.codice) : codici;
  }
  get contiRicaviCanoniValues(): string[] {
    const values = this.contiRicaviCanoni.map((q) => q.contoRicaviCanoni);
    return this.backupValue ? values.filter((value) => value !== this.backupValue.contoRicaviCanoni) : values;
  }

  /* METHODS */

  getEmptyValue(): ContiRicaviCanoniCreateBody | ContiRicaviCanoniReplaceBody {
    return {
      codice: '',
      contoRicaviCanoni: "",
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