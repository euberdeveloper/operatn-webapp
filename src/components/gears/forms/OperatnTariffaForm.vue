<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Tipo ospite"
            name="idTipoOspite"
            clearable
            :items="tipiOspite"
            item-text="sigla"
            item-value="id"
            :rules="[$validator.requiredText('Tipo ospite')]"
            v-model="internalValue.idTipoOspite"
          />
        </v-col>
        <v-col cols="6">
         <v-select
            type="text"
            label="Tipo tariffa"
            name="idTipoTariffa"
            clearable
            :items="tipiTariffa"
            item-text="tipoTariffa"
            item-value="id"
            :rules="[$validator.requiredText('Tipo tariffa')]"
            v-model="internalValue.idTipoTariffa"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
         <v-text-field
            type="text"
            label="Utilizzo stanza"
            name="idUtilizzoStanza"
            clearable
            disabled
            hint="TODO"
            v-model="internalValue.idUtilizzoStanza"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            type="text"
            label="Tipo fabbricato"
            name="idTipoFabbricato"
            clearable
            :items="tipiFabbricato"
            item-text="tipoFabbricato"
            item-value="id"
            v-model="internalValue.idTipoFabbricato"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
         <v-text-field
            type="number"
            label="Prezzo canoni"
            name="prezzoCanoni"
            clearable
            :rules="[$validator.requiredText('Prezzo canoni'), $validator.price()]"
            v-model="internalValue.prezzoCanoni"
          />
        </v-col>
        <v-col cols="6">
         <v-text-field
            type="number"
            label="Prezzo consumi"
            name="prezzoConsumi"
            clearable
            :rules="[$validator.requiredText('Prezzo consumi'), $validator.price()]"
            v-model="internalValue.prezzoConsumi"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { TariffeCreateBody, TariffeReplaceBody, TipiOspiteReturned, TipoFabbricato, TipoTariffa } from "operatn-api-client";

import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";
import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";
import TipoTariffaHandlerMixin from "@/mixins/handlers/TipoTariffaHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTariffaForm extends Mixins(TipoFabbricatoHandlerMixin, TipoOspiteHandlerMixin, TipoTariffaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<TariffeCreateBody> | Partial<TariffeReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private tipiFabbricato: TipoFabbricato[] = [];
  private tipiOspite: TipiOspiteReturned[] = [];
  private tipiTariffa: TipoTariffa[] = [];

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

  getEmptyValue(): Partial<TariffeCreateBody> | Partial<TariffeReplaceBody> {
    return {
      idTipoOspite: undefined,
      idUtilizzoStanza: null,
      idTipoFabbricato: null,
      idTipoTariffa: undefined,
      prezzoConsumi: undefined,
      prezzoCanoni: undefined,
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
    this.tipiFabbricato = await this.getTipiFabbricato();
    this.tipiTariffa = await this.getTipiTariffa();
    this.tipiOspite = await this.getTipiOspite();
  }
}
</script>