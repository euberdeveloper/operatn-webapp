<template>
  <v-form @submit.prevent v-if="value">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Id"
            name="id"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.id)"
            outlined
            readonly
            :value="value.id"
          />
        </v-col>
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Fabbricato"
            name="nomeFabbricato"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(nomeFabbricato)"
            outlined
            readonly
            :value="nomeFabbricato"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Unità immobiliare"
            name="unitaImmobiliare"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.unitaImmobiliare)"
            outlined
            readonly
            :value="value.unitaImmobiliare"
          />
        </v-col>
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Numero stanza"
            name="numeroStanza"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.numeroStanza)"
            outlined
            readonly
            :value="value.numeroStanza"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Tipo stanza"
            name="tipoStanza"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(tipoStanza)"
            outlined
            readonly
            :value="tipoStanza"
          />
        </v-col>
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Piano"
            name="piano"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.piano)"
            outlined
            readonly
            :value="value.piano"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-2 px-2">
          <v-text-field
            type="text"
            label="Centro di costo"
            name="centroDiCosto"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.centroDiCosto)"
            outlined
            readonly
            :value="value.centroDiCosto"
          />
        </v-col>
        <v-col cols="6" class="pa-2 d-flex align-center">
          <span>Accessibilità:</span>
          <v-tooltip v-if="value.bagno">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-toilet</v-icon>
            </template>
            <span>Bagno</span>
          </v-tooltip>
          <v-tooltip v-if="value.handicap">
            <template v-slot:activator="{ on, attrs }">
              <span style="position: relative"></span>
              <v-icon v-bind="attrs" v-on="on">mdi-wheelchair-accessibility</v-icon>
            </template>
            <span>Handicap</span>
          </v-tooltip>
          <v-tooltip v-if="value.gestioneDiretta">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">mdi-account-hard-hat</v-icon>
            </template>
            <span>Gestione diretta</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-textarea
            type="text"
            label="Note"
            name="note"
            hide-details
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.note)"
            outlined
            readonly
            :value="value.note"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { StanzeReturned } from "operatn-api-client";
import clipboardCopy from "clipboard-copy";

import { ActionTypes } from "@/store";

@Component
export default class OperatnStanzaInfo extends Vue {
  /* PROPS */

  @Prop({ type: Object, required: true })
  value!: StanzeReturned;

  /* GETTERS */

  get nomeFabbricato(): string {
    return this.value.fabbricato?.nome ?? "NON TROVATO";
  }

  get tipoStanza(): string {
    return this.value.tipoStanza?.tipoStanza ?? "NON TROVATO";
  }

  /* METHODS */

  copyText(text: string): void {
    clipboardCopy(text);
    this.$store.dispatch(ActionTypes.SET_TOAST, { message: "Testo copiato negli appunti", color: "success" });
  }
}
</script>