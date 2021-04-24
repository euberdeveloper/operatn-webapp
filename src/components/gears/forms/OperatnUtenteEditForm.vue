<template>
  <v-form v-model="internalFormValid" v-if="internalValue">
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-text-field type="text" label="Uid" name="uid" clearable prepend-icon="mdi-key" disabled :value="internalValue.uid" />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            label="Nome utente"
            name="nomeUtente"
            clearable
            prepend-icon="mdi-account"
            :rules="[$validator.requiredText('Nome utente'), $validator.nomeUtente()]"
            v-model="internalValue.nomeUtente"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            type="email"
            label="Email"
            name="email"
            clearable
            prepend-icon="mdi-email"
            :rules="[$validator.requiredText('Email'), $validator.email()]"
            v-model="internalValue.email"
          />
        </v-col>
        <v-col cols="6">
          <v-select v-model="internalValue.ruolo" label="Ruolo" name="ruolo" clearable prepend-icon="mdi-spider" :items="$store.state.roles" :rules="[$validator.requiredText('Ruolo'), $validator.ruoloUtente()]" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { UtentiUpdateBody, UtentiUpdateRuoloBody } from "operatn-api-client/api/controllers/utenti/index";
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";

@Component({
  model: {
    prop: "value",
    event: "save",
  },
})
export default class OperatnUtenteEditForm extends Vue {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: UtentiUpdateBody & UtentiUpdateRuoloBody;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

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

  getEmptyUtente(): UtentiUpdateBody & UtentiUpdateRuoloBody {
    return {
      nomeUtente: "",
      email: "",
      ruolo: "",
    };
  }

  /* WATCH */

  @Watch("value", { deep: true, immediate: true })
  watchValue() {
    if (this.value !== null) {
      this.internalValue = this.value;
    }
  }

  /* LIFE CYCLE */

  created() {
    this.internalValue = this.value === null ? this.getEmptyUtente() : this.value;
  }
}
</script>