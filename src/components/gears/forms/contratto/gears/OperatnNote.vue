<template>
  <v-form @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-textarea label="Note" name="note" clearable v-model="internalValue.note" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {},
})
export default class OperatnTariffa extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }
}
</script>