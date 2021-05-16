<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-autocomplete
            placeholder="Quietanziante"
            name="idQuietanziante"
            prepend-icon="mdi-account-heart"
            :items="quietanzianti"
            item-text="quietanziante"
            item-value="id"
            filled
            dense
            clearable
            v-model="internalValue.idQuietanziante"
            :rules="[$validator.requiredText('Quietanziante')]"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="Id" name="id" dense hide-details readonly :value="selectedQuietanziante.id" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Denominazione" name="denominazione" dense hide-details readonly :value="selectedQuietanziante.denominazione" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="Sesso" name="sesso" dense hide-details readonly :value="selectedQuietanziante.sesso" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Data di nascita" name="dataNascita" dense hide-details readonly :value="selectedQuietanziante.dataNascita" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="Comune di nascita" name="comuneNascita" dense hide-details readonly :value="selectedQuietanziante.comuneNascita" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Indirizzo" name="indirizzo" dense hide-details readonly :value="selectedQuietanziante.indirizzo" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="CAP" name="cap" dense hide-details readonly :value="selectedQuietanziante.cap" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Citta" name="citta" dense hide-details readonly :value="selectedQuietanziante.citta" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="Provincia" name="provincia" dense hide-details readonly :value="selectedQuietanziante.provincia" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Codice fiscale" name="codiceFiscale" dense hide-details readonly :value="selectedQuietanziante.codiceFiscale" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center" v-if="selectedQuietanziante">
        <v-col cols="6">
          <v-text-field type="text" label="Numero di telefono" name="numeroTelefono" dense hide-details readonly :value="selectedQuietanziante.numeroTelefono" />
        </v-col>
        <v-col cols="6" class="d-flex">
          <v-text-field type="text" label="Email" name="email" dense hide-details readonly :value="selectedQuietanziante.email" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody, Quietanziante } from "operatn-api-client";

import QuietanzianteHandlerMixin from "@/mixins/handlers/QuietanzianteHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnQuietanziante extends Mixins(QuietanzianteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private quietanzianti: Quietanziante[] = [];

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

  get selectedQuietanziante(): null | Quietanziante {
    return this.quietanzianti.find((q) => q.id === this.internalValue.idQuietanziante) ?? null;
  }

  /* LIFE CYCLE */

  async mounted() {
    this.quietanzianti = await this.getQuietanzianti();
  }
}
</script>