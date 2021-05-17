<template>
  <v-form v-model="internalFormValid" @submit.prevent>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
         <v-file-input v-model="internalValue" label="Contratto firmato" accept="application/pdf"  :rules="[$validator.requiredText('Contratto firmato'), $validator.maxSize(2000000)]" chips show-size />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";


@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnContrattoFirmaForm extends Vue {
  /* PROPS */

  @Prop({ validator: v => v instanceof File || v === null, default: null })
  value!: File | null;

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