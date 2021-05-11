<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Tipo bolletta"
            name="tipoBolletta"
            clearable
            :rules="[$validator.requiredText('Tipo bolletta'), $validator.unique(tipiBollettaValues)]"
            v-model="internalValue.tipoBolletta"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Sigla causale"
            name="siglaCausale"
            clearable
            :rules="[$validator.requiredText('Sigla causale'), $validator.length(1)]"
            v-model="internalValue.siglaCausale"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field type="number" label="Importo canone" name="importoCanone" clearable :rules="[$validator.price()]" v-model="internalValue.importoCanone" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="number" label="Importo consumi" name="importoConsumi" clearable :rules="[$validator.price()]" v-model="internalValue.importoConsumi" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-select
            type="text"
            label="Conto ricavi canoni"
            name="idContoRicaviCanoni"
            clearable
            :items="contiRicavi"
            item-text="codice"
            item-value="id"
            :rules="[]"
            v-model="internalValue.idContoRicaviCanoni"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            type="text"
            label="Conto ricavi cosumi"
            name="idContoRicaviConsumi"
            clearable
            :items="contiRicavi"
            item-text="codice"
            item-value="id"
            :rules="[]"
            v-model="internalValue.idContoRicaviConsumi"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            type="text"
            label="Quietanziante"
            name="idQuietanziante"
            clearable
            :items="quietanzianti"
            item-text="quietanziante"
            item-value="id"
            :rules="[]"
            v-model="internalValue.idQuietanziante"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ContoRicavi, Quietanziante, TipiBollettaCreateBody, TipiBollettaReplaceBody } from "operatn-api-client";

import ContoRicaviHandlerMixin from "@/mixins/handlers/ContoRicaviHandlerMixin";
import QuietanzianteHandlerMixin from "@/mixins/handlers/QuietanzianteHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoBollettaForm extends Mixins(ContoRicaviHandlerMixin, QuietanzianteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<TipiBollettaCreateBody> | Partial<TipiBollettaReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  tipiBollettaValues!: string[];

  /* DATA */

  private contiRicavi: ContoRicavi[] = [];
  private quietanzianti: Quietanziante[] = [];

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

  getEmptyValue(): Partial<TipiBollettaCreateBody> | Partial<TipiBollettaReplaceBody> {
    return {
      tipoBolletta: undefined,
      siglaCausale: undefined,
      importoCanone: null,
      importoConsumi: null,
      idContoRicaviConsumi: null,
      idContoRicaviCanoni: null,
      idQuietanziante: null,
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
    this.quietanzianti = await this.getQuietanzianti();
  }
}
</script>