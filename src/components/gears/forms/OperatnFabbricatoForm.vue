<template>
  <v-form v-model="internalFormValid" @submit.prevent v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Codice"
            name="codice"
            clearable
            :rules="[$validator.requiredText('Codice'), $validator.unique(fabbricatiCodici)]"
            v-model="internalValue.codice"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Nome"
            name="nome"
            clearable
            :rules="[$validator.requiredText('Nome'), $validator.unique(fabbricatiNomi)]"
            v-model="internalValue.nome"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-select
            type="text"
            label="Tipo fabbricato"
            name="idTipoFabbricato"
            clearable
            :items="tipiFabbricato"
            item-text="tipoFabbricato"
            item-value="id"
            :rules="[$validator.requiredText('Tipo fabbricato')]"
            v-model="internalValue.idTipoFabbricato"
          />
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            v-model="internalValue.provincia"
            label="Provincia"
            name="provincia"
            clearable
            :loading="isLoading.province"
            :items="province"
            item-text="sigla"
            item-value="sigla"
            :rules="[$validator.requiredText('Provincia')]"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-autocomplete
            v-model="internalValue.comune"
            label="Comune"
            name="comune"
            clearable
            :loading="isLoading.comuni"
            item-text="denominazione"
            item-value="denominazione"
            :items="comuni"
            :rules="[$validator.requiredText('Comune')]"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="CAP"
            name="cap"
            clearable
            :rules="[$validator.requiredText('CAP'), $validator.length(5), $validator.numeric()]"
            v-model="internalValue.cap"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Indirizzo"
            name="indirizzo"
            clearable
            :rules="[$validator.requiredText('Indirizzo')]"
            v-model="internalValue.indirizzo"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Numero civico"
            name="nCivico"
            clearable
            :rules="[$validator.requiredText('Numero civico')]"
            v-model="internalValue.nCivico"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from "vue-property-decorator";
import { Comune, FabbricatiCreateBody, FabbricatiReplaceBody, Provincia, TipoFabbricato } from "operatn-api-client";

import { ActionTypes, AlertType } from "@/store";
import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnFabbricatoForm extends Mixins(TipoFabbricatoHandlerMixin, TipoFabbricatoHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<FabbricatiCreateBody> | Partial<FabbricatiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  fabbricatiCodici!: string[];

  @Prop({ type: Array, default: () => [] })
  fabbricatiNomi!: string[];

  /* DATA */

  private tipiFabbricato: TipoFabbricato[] = [];
  private province: Provincia[] = [];
  private comuni: Comune[] = [];
  private isLoading = {
    province: false,
    comuni: false,
  };

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

  getEmptyValue(): Partial<FabbricatiCreateBody> | Partial<FabbricatiReplaceBody> {
    return {
      codice: undefined,
      nome: undefined,
      provincia: undefined,
      comune: undefined,
      cap: undefined,
      indirizzo: undefined,
      nCivico: undefined,
      idTipoFabbricato: undefined,
    };
  }

  async fetchProvince(): Promise<void> {
    try {
      this.isLoading.province = true;
      this.province = await this.$api.province.getAll();
    } catch (error) {
      this.province = [];
      this.$store.dispatch(ActionTypes.ALERT, { message: "Errore nel caricare le province", alertType: AlertType.ERRORS_QUEUE });
    } finally {
      this.isLoading.province = false;
    }
  }

  async fetchComuni(provincia?: string): Promise<void> {
    if (provincia) {
      try {
        this.isLoading.comuni = true;
        this.comuni = (await this.$api.comuni.getAll()).filter((c) => c.siglaProvincia === provincia);
      } catch (error) {
        this.comuni = [];
        this.$store.dispatch(ActionTypes.ALERT, { message: "Errore nel caricare i comuni", alertType: AlertType.ERRORS_QUEUE });
      } finally {
        this.isLoading.comuni = false;
      }
    } else {
      this.comuni = [];
    }
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value === null) {
      this.internalValue = this.getEmptyValue();
    }
  }

  @Watch("value.provincia", { deep: true, immediate: true })
  async watchValueProvincia(provincia) {
    await this.fetchComuni(provincia);
  }

  /* LIFE CYCLE */

  async mounted() {
    this.tipiFabbricato = await this.getTipiFabbricato();
    await this.fetchProvince();
    // TODO: add province mixin handler
    try {
      await this.fetchComuni(this.value.provincia);
    } catch (error) {}
  }
}
</script>