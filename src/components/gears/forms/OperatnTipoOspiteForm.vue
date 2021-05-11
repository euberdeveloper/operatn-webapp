<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Tipo ospite"
            name="tipoOspite"
            clearable
            :rules="[$validator.requiredText('Tipo ospite'), $validator.unique(tipiOspiteValues)]"
            v-model="internalValue.tipoOspite"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Sigla"
            name="sigla"
            clearable
            :rules="[$validator.requiredText('Sigla'), $validator.unique(tipiOspiteSigle)]"
            v-model="internalValue.sigla"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Conto ricavi canoni"
            name="idContoRicaviCanoni"
            clearable
            :items="contiRicavi"
            item-text="codice"
            item-value="id"
            :rules="[$validator.requiredText('Conto ricavi canoni')]"
            v-model="internalValue.idContoRicaviCanoni"
          />
        </v-col>
       <v-col cols="6">
          <v-select
            type="text"
            label="Conto ricavi cosumi"
            name="idContoRicaviConsumi"
            clearable
            :items="contiRicavi"
            item-text="codice"
            item-value="id"
            :rules="[$validator.requiredText('Conto ricavi cosumi')]"
            v-model="internalValue.idContoRicaviConsumi"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ContoRicavi, TipiOspiteCreateBody, TipiOspiteReplaceBody } from "operatn-api-client";

import ContoRicaviHandlerMixin from "@/mixins/handlers/ContoRicaviHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoOspiteForm extends Mixins(ContoRicaviHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<TipiOspiteCreateBody> | Partial<TipiOspiteReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  tipiOspiteSigle!: string[];

  @Prop({ type: Array, default: () => [] })
  tipiOspiteValues!: string[];

  /* DATA */

  private contiRicavi: ContoRicavi[] = [];

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

  getEmptyValue(): Partial<TipiOspiteCreateBody> | Partial<TipiOspiteReplaceBody> {
    return {
      tipoOspite: undefined,
      sigla: undefined,
      idContoRicaviConsumi: undefined,
      idContoRicaviCanoni: undefined
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
    this.contiRicavi = await this.getContiRicavi();
  }
}
</script>