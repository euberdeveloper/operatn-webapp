<template>
  <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        :label="label"
        hint="Formato DD/MM/YYYY"
        persistent-hint
        :prepend-icon="icon"
        v-bind="attrs"
        :rules="rules"
        @blur="internalValue = parseDate(dateFormatted)"
        @keypress.enter="enterClicked"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="internalValue" no-title @input="menu = false" />
  </v-menu>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
  model: {
    prop: "value",
    event: "change",
  },
})
export default class OperatnDateInput extends Vue {
  /* PROPS */

  @Prop({ validator: (v) => typeof v === "object" || v === null, required: true })
  value!: Date | null;

  @Prop({ type: String, required: true })
  label!: string;

  @Prop({ type: String, required: false })
  icon?: string;

  @Prop({ type: Array, default: () => [] })
  rules!: any[];

  /* DATA */

  private menu = false;
  private dateFormatted: string | null = null;

  /* GETTERS AND SETTERS */

  get internalValue(): string | null {
    return this.value ? this.value.toISOString().slice(0, 10) : null;
  }
  set internalValue(value: string | null) {
    const dateVal = value ? new Date(value) : null;
    this.$emit("change", dateVal && !isNaN(+dateVal) ? dateVal : null);
  }

  /* WATCH */

  @Watch("value")
  watchValue() {
    this.dateFormatted = this.formatDate(this.value);
  }

  /* METHODS */

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    const [year, month, day] = date.toISOString().slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
  }

  parseDate(date: string | null): Date | null {
    if (!date) return null;
    const [day, month, year] = date.split("/");
    const dateValue = new Date(+year, +month, +day);
    return isNaN(+dateValue) ? null : dateValue;
  }

  enterClicked(): void {
    const doc: any = document;
    if (doc?.activeElement?.blur) {
      doc.activeElement.blur();
    }
    this.menu = false;
  }

  /* LIFE CYCLE */

  created() {
    this.dateFormatted = this.formatDate(this.value);
  }
}
</script>