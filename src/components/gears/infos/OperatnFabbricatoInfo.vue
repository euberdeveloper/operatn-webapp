<template>
  <v-form @submit.prevent v-if="value">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Id"
            name="id"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.id)"
            outlined
            readonly
            :value="value.id"
          />
        </v-col>
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Codice"
            name="codice"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.codice)"
            outlined
            readonly
            :value="value.codice"
          />
        </v-col>
        
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Nome"
            name="nome"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.nome)"
            outlined
            readonly
            :value="value.nome"
          />
        </v-col>
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Tipo fabbricato"
            name="tipoFabbricato"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.tipoFabbricato)"
            outlined
            readonly
            :value="tipoFabbricato"
          />
        </v-col>
        
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Provincia"
            name="provincia"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.provincia)"
            outlined
            readonly
            :value="value.provincia"
          />
        </v-col>
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Comune"
            name="comune"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.comune)"
            outlined
            readonly
            :value="value.comune"
          />
        </v-col>
        
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="CAP"
            name="cap"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(value.cap)"
            outlined
            readonly
            :value="value.cap"
          />
        </v-col>
        <v-col cols="6" class="py-0 px-2">
          <v-text-field
            type="text"
            label="Indirizzo"
            name="indirizzo"
            dense
            append-icon="mdi-content-copy"
            @click:append="copyText(indirizzo)"
            outlined
            readonly
            :value="indirizzo"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { FabbricatiReturned } from "operatn-api-client";
import clipboardCopy from "clipboard-copy";

import { ActionTypes } from "@/store";

@Component
export default class OperatnFabbricatoInfo extends Vue {
  /* PROPS */

  @Prop({ type: Object, required: true })
  value!: FabbricatiReturned;

  /* GETTERS */

  get tipoFabbricato(): string {
    return this.value.tipoFabbricato?.tipoFabbricato ?? "NON TROVATO";
  }

  get indirizzo(): string {
    const nCivico = this.value.nCivico ?? '';
    return `${this.value.indirizzo} ${nCivico}`;
  }

  /* METHODS */

  copyText(text: string): void {
    clipboardCopy(text);
    this.$store.dispatch(ActionTypes.SET_TOAST, { message: 'Testo copiato negli appunti', color: 'success' });
  }
}
</script>