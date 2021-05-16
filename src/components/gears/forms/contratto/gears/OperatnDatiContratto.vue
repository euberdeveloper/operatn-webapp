<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <operatn-date-input label="Data inizio" name="dataInizio" v-model="internalValue.dataInizio" clearable :rules="[$validator.requiredText('Data inizio')]" />
        </v-col>
        <v-col cols="6">
          <operatn-date-input label="Data fine" name="dataFine" v-model="internalValue.dataFine" clearable :rules="[$validator.requiredText('Data fine')]" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            label="Tipo rata"
            name="tipoRata"
            clearable
            :items="$store.state.tipiRata"
            item-text="label"
            item-value="tipoRata"
            v-model="internalValue.tipoRata"
            :rules="[$validator.requiredText('Tipo rata')]"
          />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-checkbox v-model="internalValue.checkout" label="Checkout" />
          <v-checkbox v-model="internalValue.cauzione" label="Cauzione" class="ml-6" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody } from "operatn-api-client";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    OperatnDateInput,
  },
})
export default class OperatnDatiContratto extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

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

}
</script>