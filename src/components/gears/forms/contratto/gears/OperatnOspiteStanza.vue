<template>
  <v-form @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <operatn-ospite-input label="Ospite" name="idOspite" :dataInizioContratto="dataInizio" :dataFineContratto="dataFine"  :rules="[$validator.requiredText('Ospite')]" v-model="idOspite" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-autocomplete
            placeholder="Fabbricato"
            name="idFabbricato"
            prepend-icon="mdi-home-city"
            :items="fabbricati"
            :item-text="(f) => `${f.codice} - ${f.nome}`"
            return-object
            filled
            dense
            clearable
            v-model="selectedFabbricato"
          >
            <template v-slot:append-outer v-if="selectedFabbricato">
              <v-btn icon color="primary" :to="`fabbricati/${selectedFabbricato.id}`"><v-icon>mdi-eye</v-icon></v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedFabbricato">
        <v-col cols="6">
          <v-select
            placeholder="Tipo stanza"
            name="idTipoStanza"
            :items="tipiStanza"
            item-text="tipoStanza"
            item-value="id"
            clearable
            dense
            v-model="filters.idTipoStanza"
          />
        </v-col>
        <v-col cols="6">
          <v-select placeholder="Sesso" name="sesso" :items="['MASCHIO', 'FEMMINA']" clearable dense v-model="filters.sesso" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedFabbricato">
        <v-col cols="12">
          <v-select chips multiple dense placeholder="Filtri" :items="['bagno', 'handicap', 'doppia uso singola']" v-model="filters.functs" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedFabbricato">
        <v-col cols="12">
          <v-autocomplete
            :placeholder="filtersParsed.doppiaUsoSingola ? 'Stanza' : 'Posto letto'"
            name="postoLetto"
            prepend-icon="mdi-home"
            :items="postiLettoItems"
            item-text="label"
            item-value="value"
            filled
            dense
            clearable
            v-model="internalValue.postiLetto"
          >
            <template v-slot:append-outer v-if="internalValue.postiLetto.length">
              <v-btn icon color="primary" :to="`fabbricati/${selectedFabbricato.id}/stanze/${internalValue.postiLetto[0].idStanza}`"><v-icon>mdi-eye</v-icon></v-btn>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { FabbricatiReturned, OspitiReturned, PostoLetto, Sesso, TipoStanza } from "operatn-api-client";

import FabbricatoHandlerMixin from "@/mixins/handlers/FabbricatoHandlerMixin";
import StanzaHandlerMixin from "@/mixins/handlers/StanzaHandlerMixin";
import OspiteHandlerMixin from "@/mixins/handlers/OspiteHandlerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";

import OperatnOspiteInput from "@/components/gears/inputs/OperatnOspiteInput.vue";
import { AlertType } from "@/store";

export interface PostoLettoValue {
  idPostoLetto: number;
  postoLetto: string;
  idStanza: number;
  unitaImmobiliare: string;
  numeroStanza: string;
  idFabbricato: number;
  codiceFabbricato: string;
  nomeFabbricato: string;
}

export interface Value {
  ospite: OspitiReturned | null;
  postiLetto: PostoLettoValue[];
}

interface Filters {
  idTipoStanza?: number;
  sesso?: Sesso;
  functs: string[];
  stanza?: string;
}

interface FiltersParsed {
  idTipoStanza?: number;
  sesso?: Sesso;
  bagno?: boolean;
  handicap?: boolean;
  doppioUsoSingola?: boolean;
}

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    OperatnOspiteInput,
  },
})
export default class OperatnOspiteStanza extends Mixins(FabbricatoHandlerMixin, StanzaHandlerMixin, OspiteHandlerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<Value>;

  @Prop({ type: Date, required: true })
  dataInizio!: Date;

  @Prop({ type: Date, required: true })
  dataFine!: Date;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private idOspite: number | null = null;

  private fabbricati: FabbricatiReturned[] = [];
  private selectedFabbricato: FabbricatiReturned | null = null;

  private tipiStanza: TipoStanza[] = [];
  private filters: Filters = {
    idTipoStanza: undefined,
    sesso: undefined,
    functs: [],
  };

  private postiLettoItems: { label: string; value: PostoLettoValue[] }[] = [];

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }

  get filtersParsed(): FiltersParsed {
    return {
      idTipoStanza: this.filters.idTipoStanza,
      sesso: this.filters.sesso,
      bagno: this.filters.functs.includes("bagno") || undefined,
      handicap: this.filters.functs.includes("handicap") || undefined,
      doppioUsoSingola: this.filters.functs.includes("doppia uso singola") || undefined,
    };
  }

  async updatePostiLetto(): Promise<void> {
    if (this.selectedFabbricato) {
      const stanzeLibere = await this.getStanzeLibere(this.selectedFabbricato.id, {
        dataInizio: this.dataInizio,
        dataFine: this.dataFine,
        bagno: this.filtersParsed.bagno,
        sesso: this.filtersParsed.sesso,
        handicap: this.filtersParsed.handicap,
        idTipoStanza: this.filtersParsed.idTipoStanza,
        doppiaUsoSingola: this.filtersParsed.doppioUsoSingola,
      });
      this.postiLettoItems = stanzeLibere.reduce<{ label: string; value: PostoLettoValue[] }[]>((result, st) => {
        const postiLetto = st.postiLetto as PostoLetto[];
        const fabbricato = this.selectedFabbricato as FabbricatiReturned;

        if (this.filtersParsed.doppioUsoSingola) {
          result.push({
            label: `${st.unitaImmobiliare} - ${st.numeroStanza}`,
            value: postiLetto.map((pl) => ({
              idPostoLetto: pl.id,
              postoLetto: pl.postoLetto,
              idStanza: st.id,
              unitaImmobiliare: st.unitaImmobiliare,
              numeroStanza: st.numeroStanza,
              idFabbricato: fabbricato.id,
              codiceFabbricato: fabbricato.codice,
              nomeFabbricato: fabbricato.nome,
            })),
          });
        } else {
          postiLetto.forEach((pl) => {
            result.push({
              label: `${st.unitaImmobiliare} - ${st.numeroStanza} - ${pl.postoLetto}`,
              value: [
                {
                  idPostoLetto: pl.id,
                  postoLetto: pl.postoLetto,
                  idStanza: st.id,
                  unitaImmobiliare: st.unitaImmobiliare,
                  numeroStanza: st.numeroStanza,
                  idFabbricato: fabbricato.id,
                  codiceFabbricato: fabbricato.codice,
                  nomeFabbricato: fabbricato.nome,
                },
              ],
            });
          });
        }

        return result;
      }, []);
    } else {
      this.postiLettoItems = [];
    }
  }

  /* WATCH */

  @Watch("internalValue", { deep: true })
  async watchInternalValue() {
    if (this.internalValue === null) {
      this.internalValue = this.getEmptyBody();
    }

    this.$emit("update:formValid", !!this.internalValue.ospite && !!this.internalValue.postiLetto?.length);
  }

  @Watch("idOspite")
  async watchIdOspite() {
    this.internalValue.ospite = this.idOspite ? await this.getOspite(this.idOspite, { persona: true }, AlertType.ERRORS_QUEUE) : null;
  }

  @Watch("selectedFabbricato")
  async watchSelectedFabbricato() {
    this.updatePostiLetto();
  }
  @Watch("filtersParsed", { deep: true })
  async watchFiltersParsed() {
    this.updatePostiLetto();
  }

  /* METHODS */

  getEmptyBody(): Partial<Value> {
    return {
      ospite: null,
      postiLetto: [],
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    if (this.internalValue === null) {
      this.internalValue = this.getEmptyBody();
    }

    this.fabbricati = await this.getFabbricati({}, AlertType.ERRORS_QUEUE);
    this.tipiStanza = await this.getTipiStanza(AlertType.ERRORS_QUEUE);
  }
}
</script>