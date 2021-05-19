<template>
  <v-form v-model="internalFormValid" @submit.prevent>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
         <operatn-date-input label="Data chiusura anticipata" name="dataChiusuraAnticipata" clearable v-model="internalValue" :rules="[$validator.requiredText('Data chiusura anticipata'), $validator.before(dataFineContratto, internalValue), $validator.after(handledDataInizio, internalValue)]" required />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";


@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    OperatnDateInput
  }
})
export default class OperatnContrattoChiudiForm extends Vue {
  /* PROPS */

  @Prop({ validator: v => v instanceof Date || v === null, default: null })
  value!: Date | null;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Date, required: true })
  dataInizioContratto!: Date;

  @Prop({ type: Date, required: true })
  dataFineContratto!: Date;

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

  get handledDataInizio(): Date {
    const today = new Date();
    return +today > +this.dataInizioContratto ? today : this.dataInizioContratto;
  }

}
</script>