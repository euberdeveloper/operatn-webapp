<template>
  <v-autocomplete
    v-model="internalValue"
    :items="items"
    :search-input.sync="searchQuery"
    :label="label"
    item-text="label"
    item-value="value"
    clearable
    placeholder="Cognome Nome"
    :loading="isLoading"
    no-filter
    :append-icon="icon"
    v-bind="$attrs"
  >
    <template v-slot:append-item>
      <v-chip v-if="canLoadMore" v-intersect="onScrollToBottom">Caricamento...</v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from "vue-property-decorator";
import { OspitiReturned } from "operatn-api-client";

import OspiteHandlerMixin from "@/mixins/handlers/OspiteHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "change",
  },
})
export default class OperatnOspiteInput extends Mixins(OspiteHandlerMixin) {
  /* PROPS */

  @Prop({ validator: (v) => typeof v === "number" || v === null, required: true })
  value!: number | null;

  @Prop({ type: Number, default: 10 })
  pageSize!: number;

  @Prop({ type: String, required: true })
  label!: string;

  @Prop({ type: String, required: false })
  icon?: string;

  @Prop({ type: Array, default: () => [] })
  rules!: any[];

  @Prop({ type: Date, required: false })
  dataInizioContratto?: Date;

  @Prop({ type: Date, required: false })
  dataFineContratto?: Date;

  /* DATA */

  private ospiti: OspitiReturned[] = [];
  private searchQuery = "";
  private page = 1;
  private canLoadMore = false;
  private isLoading = false;

  /* GETTERS AND SETTERS */

  get internalValue(): number | null {
    return this.value;
  }
  set internalValue(value: number | null) {
    this.$emit("change", value);
  }

  get items(): { label: string; value: number }[] {
    return this.ospiti.map((ospite) => ({
      value: ospite.id,
      label: this.getOspiteText(ospite),
    }));
  }

  /* WATCH */

  @Watch("searchQuery")
  watchSearchQuery(value: string) {
    const selectedOspite = typeof this.internalValue === "number" ? this.ospiti.find(o => o.id === this.internalValue) : null;
    if (!selectedOspite || value !== this.getOspiteText(selectedOspite)) {
      const val = value && value.trim();
      if (val) {
        this.internalValue = null;
        this.page = 1;
        this.search();
      }
    }
    else {
      this.ospiti = [selectedOspite];
    }
  }
  @Watch("page")
  watchPage(value: number) {
    if (value !== 1) {
      this.search();
    }
  }

  /* METHODS */

  getOspiteText(ospite?: OspitiReturned): string {
    return ospite ? `ID:${ospite.id} ${ospite.cognome} ${ospite.nome} ${ospite.sesso[0]} ${ospite.dataDiNascita.toLocaleDateString()}` : '';
  }

  onScrollToBottom(entries: any[]): void {
    if (entries[0].intersectionRatio > 0) {
      this.page++;
    }
  }

  async search(): Promise<void> {
    try {
      this.isLoading = true;
      const ospiti = await this.getOspiti({
        search: this.searchQuery ?? "",
        page: this.page,
        pageSize: this.pageSize,
        dataInizio: this.dataInizioContratto ?? undefined,
        dataFine: this.dataFineContratto ?? undefined
      });
      this.canLoadMore = ospiti.length >= this.pageSize;
      if (this.page === 1) {
        this.ospiti = ospiti;
      } else {
        this.ospiti.push(...ospiti);
      }
    } finally {
      this.isLoading = false;
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    await this.search();
    this.page++;
  }
}
</script>