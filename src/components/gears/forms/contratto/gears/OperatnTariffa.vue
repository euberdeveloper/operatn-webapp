<template>
  <v-form @submit.prevent v-if="internalValue">
    <v-container fluid v-if="body">
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Tipo ospite"
            name="idTipoOspite"
            clearable
            :items="tipiOspiteItems"
            item-text="label"
            item-value="value"
            v-model="body.idTipoOspite"
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
            v-model="body.idTipoTariffa"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Utilizzo stanza"
            name="idUtilizzoStanza"
            clearable
            :items="tipiStanza"
            item-text="tipoStanza"
            item-value="id"
            v-model="body.idUtilizzoStanza"
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
            v-model="body.idTipoFabbricato"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedTariffa">
        <v-col cols="6">
          <v-text-field type="text" label="Prezzo canoni" name="prezzoCanoni" readonly :value="`€ ${selectedTariffa.prezzoCanoni}`" />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Prezzo consumi" name="prezzoConsumi" readonly :value="`€ ${selectedTariffa.prezzoConsumi}`" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody, Tariffa, TipiOspiteReturned, TipoFabbricato, TipoStanza, TipoTariffa } from "operatn-api-client";

import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";
import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";
import TipoTariffaHandlerMixin from "@/mixins/handlers/TipoTariffaHandlerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";
import TariffaHandlerMixin from "@/mixins/handlers/TariffaHandlerMixin";
import { AlertType } from "@/store";

interface Body {
  idTipoOspite: null | number;
  idUtilizzoStanza: null | number;
  idTipoFabbricato: null | number;
  idTipoTariffa: null | number;
}

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {},
})
export default class OperatnTariffa extends Mixins(
  TipoFabbricatoHandlerMixin,
  TipoOspiteHandlerMixin,
  TipoTariffaHandlerMixin,
  TipoStanzaHandlerMixin,
  TariffaHandlerMixin
) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private tipiFabbricato: TipoFabbricato[] = [];
  private tipiStanza: TipoStanza[] = [];
  private tipiOspite: TipiOspiteReturned[] = [];
  private tipiTariffa: TipoTariffa[] = [];
  private tariffe: Tariffa[] = [];

  private tipoTariffaDefault: TipoTariffa | null = null;
  private body: Body | null = null;
  private selectedTariffa: null | Tariffa = null;

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }

  get tipiOspiteItems() {
    return this.tipiOspite.map((to) => ({
      label: `${to.sigla} - ${to.tipoOspite}`,
      value: to.id,
    }));
  }

  /* WATCH */

  @Watch("body", { deep: true })
  watchBody() {
    if (this.body && this.tariffe.length) {
      this.selectedTariffa =
        this.tariffe.find(
          (t) =>
            t.idTipoOspite === (this.body as any).idTipoOspite &&
            t.idUtilizzoStanza === (this.body as any).idUtilizzoStanza &&
            t.idTipoFabbricato === (this.body as any).idTipoFabbricato &&
            t.idTipoTariffa === (this.body as any).idTipoTariffa
        ) ?? null;
    }
  }

  @Watch("selectedTariffa", { deep: true })
  watchSelectedTariffa() {
    if (this.tariffe.length) {
      this.internalValue.idTariffa = this.selectedTariffa ? this.selectedTariffa.id : undefined;
      this.$emit("update:formValid", !!this.selectedTariffa);
    }
  }

  @Watch("internalValue", { deep: true })
  watchValue() {
    const tariffa = this.tariffe.find((t) => t.id === this.internalValue.idTariffa);
    this.body = tariffa
      ? {
          idTipoOspite: tariffa.idTipoOspite,
          idUtilizzoStanza: tariffa.idUtilizzoStanza,
          idTipoFabbricato: tariffa.idTipoFabbricato,
          idTipoTariffa: tariffa.idTipoTariffa,
        }
      : this.getEmptyBody();
  }

  @Watch("tipoTariffaDefault")
  watchSelectedTipoTariffaDefault() {
    if (this.body && typeof this.body.idTipoTariffa !== "number") {
      this.body.idTipoTariffa = this.tipoTariffaDefault?.id ?? null;
    }
  }

  /* METHODS */

  getEmptyBody() {
    return {
      idTipoOspite: null as number | null,
      idUtilizzoStanza: null as number | null,
      idTipoFabbricato: null as number | null,
      idTipoTariffa: this.tipoTariffaDefault?.id as number | null,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.tipiFabbricato = await this.getTipiFabbricato(AlertType.ERRORS_QUEUE);
    this.tipiStanza = await this.getTipiStanza(AlertType.ERRORS_QUEUE);
    this.tipiTariffa = await this.getTipiTariffa(AlertType.ERRORS_QUEUE);
    this.tipiOspite = await this.getTipiOspite({}, AlertType.ERRORS_QUEUE);
    this.tariffe = await this.getTariffe({}, AlertType.ERRORS_QUEUE);

    this.tipoTariffaDefault = await this.getTipoTariffaByValue("MENSILE", AlertType.ERRORS_QUEUE);

    this.body = typeof this.internalValue.idTariffa !== "number" ? this.getEmptyBody() : (this.tariffe.find((t) => t.id === this.internalValue.idTariffa) ?? null);
  }
}
</script>