<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Unità immobiliare"
            name="unitaImmobiliare"
            clearable
            :rules="[$validator.requiredText('Unità immobiliare')]"
            v-model="internalValue.unitaImmobiliare"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Numero stanza"
            name="numeroStanza"
            clearable
            :rules="[$validator.requiredText('Numero stanza')]"
            v-model="internalValue.numeroStanza"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Tipo stanza"
            name="idTipoStanza"
            clearable
            :items="tipiStanza"
            item-text="tipoStanza"
            item-value="id"
            :rules="[$validator.requiredText('Tipo stanza')]"
            v-model="internalValue.idTipoStanza"
          />
        </v-col>
        <v-col cols="6">
          <v-select
            type="text"
            label="Piano"
            name="piano"
            clearable
            :items="piani"
            item-text="label"
            item-value="piano"
            :rules="[$validator.requiredText('Piano')]"
            v-model="internalValue.piano"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Centro di costo"
            name="centroDiCosto"
            clearable
            :rules="[$validator.requiredText('Centro di costo')]"
            v-model="internalValue.centroDiCosto"
          />
        </v-col>
        <v-col cols="6" class="d-flex justify-space-between">
          <v-checkbox v-model="internalValue.bagno" label="Bagno" />
          <v-checkbox v-model="internalValue.handicap" label="Handicap" />
          <v-checkbox v-model="internalValue.gestioneDiretta" label="Gestione diretta" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-textarea
            type="text"
            label="Note"
            name="note"
            clearable
            v-model="internalValue.note"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { StanzeCreateBody, StanzeReplaceBody, TipoStanza } from "operatn-api-client";

import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnStanzaForm extends Mixins(TipoStanzaHandlerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<StanzeCreateBody> | Partial<StanzeReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private tipiStanza: TipoStanza[] = [];

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

  get piani() {
    return this.$store.state.piani;
  }

  /* METHODS */

  getEmptyValue(): Partial<StanzeCreateBody> | Partial<StanzeReplaceBody> {
    return {
      unitaImmobiliare: undefined,
      numeroStanza: undefined,
      piano: undefined,
      bagno: false,
      centroDiCosto: undefined,
      gestioneDiretta: false,
      handicap: false,
      note: undefined,
      idTipoStanza: undefined,
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
    this.tipiStanza = await this.getTipiStanza();
  }
}
</script>