<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Quietanziante"
            name="quietanziante"
            clearable
            :rules="[$validator.requiredText('Quietanziante'), $validator.unique(quietanziantiValues)]"
            v-model="internalValue.quietanziante"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Denominazione" name="denominazione" clearable v-model="internalValue.denominazione" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select type="text" label="Sesso" name="sesso" :items="['M', 'F']" clearable v-model="internalValue.sesso" />
        </v-col>
        <v-col cols="6">
          <operatn-date-input label="Data nascita" name="dataNascita" v-model="internalValue.dataNascita" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field type="text" label="Comune di nascita" name="comuneNascita" clearable v-model="internalValue.comuneNascita" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Indirizzo" name="indirizzo" clearable v-model="internalValue.indirizzo" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="CAP"
            name="cap"
            clearable
            :rules="[$validator.length(5), $validator.numeric()]"
            v-model="internalValue.cap"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Citta" name="citta" clearable v-model="internalValue.citta" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field type="text" label="Sigla provincia" name="siglaProvincia" clearable v-model="internalValue.siglaProvincia" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Codice fiscale" name="codiceFiscale" clearable v-model="internalValue.codiceFiscale" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field type="text" label="Numero di telefono" name="numeroTelefono" clearable v-model="internalValue.numeroTelefono" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Email" name="email" clearable v-model="internalValue.email" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { QuietanziantiCreateBody, QuietanziantiReplaceBody } from "operatn-api-client";

import OperatnDateInput from '@/components/gears/inputs/OperatnDateInput.vue';

@Component({
  components: {
    OperatnDateInput
  },
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnQuietanzianteForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: QuietanziantiCreateBody | QuietanziantiReplaceBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  quietanziantiValues!: string[];

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

  getEmptyValue(): QuietanziantiCreateBody | QuietanziantiReplaceBody {
    return {
      quietanziante: "",
      denominazione: null,
      sesso: null,
      dataNascita: null,
      comuneNascita: null,
      indirizzo: null,
      cap: null,
      citta: null,
      siglaProvincia: null,
      codiceFiscale: null,
      numeroTelefono: null,
      email: null,
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