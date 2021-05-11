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
            :rules="[$validator.requiredText('Codice'), $validator.unique(dipartimentiUnitnCodici), $validator.length(4)]"
            v-model="internalValue.codice"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Sigla"
            name="sigla"
            clearable
            :rules="[$validator.requiredText('Sigla'), $validator.unique(dipartimentiUnitnSigle)]"
            v-model="internalValue.sigla"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Nome"
            name="nome"
            clearable
            :rules="[$validator.requiredText('Nome'), $validator.unique(dipartimentiUnitnNomi)]"
            v-model="internalValue.nome"
          />
        </v-col>
        <v-col cols="6">
          <v-autocomplete
            v-model="internalValue.provincia"
            label="Provincia"
            name="provincia"
            clearable
            :loading="isLoading.privince"
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
        <v-col cols="6" class="d-flex flex-row">
          <v-text-field
            style="flex: 3"
            type="text"
            label="Indirizzo"
            name="indirizzo"
            clearable
            :rules="[$validator.requiredText('Indirizzo')]"
            v-model="internalValue.indirizzo"
          />
          <v-text-field
            style="flex: 1"
            type="text"
            label="Numero Civico"
            name="nCivico"
            clearable
            :rules="[$validator.requiredText('Numero civico')]"
            v-model="internalValue.nCivico"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field type="text" label="Sito web" name="sitoWeb" clearable :rules="[$validator.requiredText('Sito web')]" v-model="internalValue.sitoWeb" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { Comune, DipartimentiUnitnCreateBody, DipartimentiUnitnUpdateBody, Provincia } from "operatn-api-client";
import { ActionTypes, AlertType } from "@/store";


@Component({
  model: {
    prop: "value",
    event: "save",
  }
})
export default class OperatnDipartimentoUnitnForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: DipartimentiUnitnCreateBody | DipartimentiUnitnUpdateBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  @Prop({ type: Array, default: () => [] })
  dipartimentiUnitnCodici!: string[];

  @Prop({ type: Array, default: () => [] })
  dipartimentiUnitnSigle!: string[];

  @Prop({ type: Array, default: () => [] })
  dipartimentiUnitnNomi!: string[];

  /* DATA */

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

  getEmptyValue(): DipartimentiUnitnCreateBody | DipartimentiUnitnUpdateBody {
    return {
      codice: "",
      sigla: "",
      nome: "",
      provincia: "",
      comune: "",
      cap: "",
      indirizzo: "",
      nCivico: "",
      sitoWeb: "",
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
    await this.fetchProvince();
    // TODO: add province mixin handler
    try {
      await this.fetchComuni(this.value.provincia);
    } catch (error) {}
  }
}
</script>