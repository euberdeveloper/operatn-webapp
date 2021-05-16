<template>
  <v-expansion-panels v-model="detailsExpanded" multiple class="mt-4">
    <v-expansion-panel>
      <v-expansion-panel-header :disable-icon-rotate="datiContrattoValid">
        <span class="text-h6">Dati contratto</span>
        <template v-slot:actions v-if="datiContrattoValid">
          <v-icon color="teal">mdi-check</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <operatn-dati-contratto v-model="internalValue" :formValid.sync="datiContrattoValid" />
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header :disable-icon-rotate="quietanzianteValid">
        <span class="text-h6">Quietanziante</span>
        <template v-slot:actions v-if="quietanzianteValid">
          <v-icon color="teal">mdi-check</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <operatn-quietanziante v-model="internalValue" :formValid.sync="quietanzianteValid" />
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header :disable-icon-rotate="tipoContrattoValid">
        <span class="text-h6">Tipo contratto</span>
        <template v-slot:actions v-if="tipoContrattoValid">
          <v-icon color="teal">mdi-check</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <operatn-tipo-contratto v-model="internalValue" :formValid.sync="tipoContrattoValid" />
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header :disable-icon-rotate="tariffaValid">
        <span class="text-h6">Tariffa</span>
        <template v-slot:actions v-if="tariffaValid">
          <v-icon color="teal">mdi-check</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <operatn-tariffa v-model="internalValue" :formValid.sync="tariffaValid" />
      </v-expansion-panel-content>
    </v-expansion-panel>

    <v-expansion-panel>
      <v-expansion-panel-header :disable-icon-rotate="ospitiPostiLettoValid">
        <span class="text-h6">Ospiti / Posti letto</span>
        <template v-slot:actions v-if="ospitiPostiLettoValid">
          <v-icon color="teal">mdi-check</v-icon>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <operatn-ospiti-stanze v-model="internalValue" :formValid.sync="ospitiPostiLettoValid" />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody } from "operatn-api-client";

import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";
import OperatnDatiContratto from "./gears/OperatnDatiContratto.vue";
import OperatnQuietanziante from "./gears/OperatnQuietanziante.vue";
import OperatnTipoContratto from "./gears/OperatnTipoContratto.vue";
import OperatnTariffa from "./gears/OperatnTariffa.vue";
import OperatnOspitiStanze from "./gears/OperatnOspitiStanze.vue";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    OperatnDateInput,
    OperatnDatiContratto,
    OperatnQuietanziante,
    OperatnTipoContratto,
    OperatnTariffa,
    OperatnOspitiStanze,
  },
})
export default class OperatnContrattoForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private detailsExpanded = [0];
  private datiContrattoValid = false;
  private quietanzianteValid = false;
  private tipoContrattoValid = false;
  private tariffaValid = false;
  private ospitiPostiLettoValid = false;

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

  getEmptyValue(): Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody> {
    return {
      dataInizio: undefined,
      dataFine: undefined,
      checkout: undefined,
      cauzione: undefined,
      tipoRata: undefined,
      idTariffa: undefined,
      idTipoContratto: undefined,
      idQuietanziante: undefined,
      ospiti: [],
      note: null,
    };
  }

  computeFormValid(): boolean {
    return this.datiContrattoValid && this.quietanzianteValid && this.tipoContrattoValid && this.tariffaValid && this.ospitiPostiLettoValid;
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.internalValue === null) {
      this.internalValue = this.getEmptyValue();
    }
  }

  @Watch("datiContrattoValid")
  watchDatiContrattoValid() {
    this.$emit("update:formValid", this.computeFormValid());
  }
  @Watch("quietanzianteValid")
  watchQuietanzianteValid() {
    this.$emit("update:formValid", this.computeFormValid());
  }
  @Watch("tipoContrattoValid")
  watchTipoContrattoValid() {
    this.$emit("update:formValid", this.computeFormValid());
  }
  @Watch("tariffaValid")
  watchTariffaValid() {
    this.$emit("update:formValid", this.computeFormValid());
  }
  @Watch("ospitiPostiLettoValid")
  watchOspitiPostiLettoValid() {
    this.$emit("update:formValid", this.computeFormValid());
  }

  /* LIFE CYCLE */

  mounted() {
    if (this.internalValue === null) {
      this.internalValue = this.getEmptyValue();
    }
  }
}
</script>