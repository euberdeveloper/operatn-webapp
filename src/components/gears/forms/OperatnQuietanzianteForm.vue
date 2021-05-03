<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-text-field
            type="text"
            label="Quietanziante"
            name="quietanziante"
            clearable
            prepend-icon="mdi-account-heart"
            :rules="[$validator.requiredText('Quietanziante'), $validator.unique(quietanziantiValues)]"
            v-model="internalValue.quietanziante"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { QuietanziantiCreateBody, QuietanziantiReplaceBody } from "operatn-api-client";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnQuietanzianteForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: QuietanziantiCreateBody | QuietanziantiReplaceBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  quietanziantiValues!: string[];

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

  getEmptyValue(): QuietanziantiCreateBody | QuietanziantiReplaceBody {
    return {
      quietanziante: "",
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