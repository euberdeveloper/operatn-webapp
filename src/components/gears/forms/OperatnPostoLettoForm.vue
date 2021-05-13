<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Posto letto"
            name="postoLetto"
            clearable
            :rules="[$validator.requiredText('Posto letto'), $validator.unique(postiLettoValues)]"
            v-model="internalValue.postoLetto"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Watch } from "vue-property-decorator";
import { PostiLettoCreateBody, PostiLettoReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnPostoLettoForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<PostiLettoCreateBody> | Partial<PostiLettoReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  postiLettoValues!: string[];


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

  getEmptyValue(): Partial<PostiLettoCreateBody> | Partial<PostiLettoReplaceBody> {
    return {
      postoLetto: undefined
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