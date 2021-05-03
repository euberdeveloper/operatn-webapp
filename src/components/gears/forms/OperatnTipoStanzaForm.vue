<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Tipo stanza"
            name="tipoStanza"
            clearable
            prepend-icon="mdi-home-group"
            :rules="[$validator.requiredText('Tipo stanza'), $validator.unique(tipiStanzaValues)]"
            v-model="internalValue.tipoStanza"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { TipiStanzaCreateBody, TipiStanzaReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnTipoStanzaForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: TipiStanzaCreateBody | TipiStanzaReplaceBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  tipiStanzaValues!: string[];

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

  getEmptyValue(): TipiStanzaCreateBody | TipiStanzaReplaceBody {
    return {
      tipoStanza: "",
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