<template>
  <v-card>
    <v-card-title class="headline primary white--text">Il tuo profilo</v-card-title>
    <v-card-text>
      <operatn-utente-edit-form v-if="updateBody" v-model="updateBody" :formValid.sync="updateBodyValid" canChangePassword class="mt-6" />
    </v-card-text>
    <v-card-actions class="pa-4">
      <v-spacer />
      <v-btn large color="error" @click="cancel">
        ANNULLA
        <v-icon right dark>mdi-cancel</v-icon>
      </v-btn>
      <v-btn large color="primary" @click="confirm" :disabled="!updateBodyValid">SALVA<v-icon right dark>mdi-content-save</v-icon></v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { UtentiReturned } from "operatn-api-client";

import { MutationTypes } from "@/store";

import UtenteHandlerMixin, { UtentiHandlerUpdateBody } from "@/mixins/handlers/UtenteHandlerMixin";
import OperatnUtenteEditForm from "@/components/gears/forms/OperatnUtenteEditForm.vue";

@Component({
  components: {
    OperatnUtenteEditForm,
  },
})
export default class UserInfo extends Mixins(UtenteHandlerMixin) {
  /* DATA */
  private updateBodyValid = true;
  private updateBody: (UtentiHandlerUpdateBody & { uid: string }) | null = null;

  /* GETTERS AND SETTERS */

  get user(): UtentiReturned {
    return this.$store.state?.user as UtentiReturned;
  }

  /* METHODS */

  resetUpdateBody(): void {
    this.updateBody = {
      uid: this.user.uid,
      nomeUtente: this.user.nomeUtente,
      email: this.user.email,
      ruolo: this.user.ruolo,
      password: "",
    };
  }

  cancel(): void {
    this.resetUpdateBody();
  }

  async confirm(): Promise<void> {
    if (this.updateBodyValid && this.updateBody) {
      await this.updateUtente(this.updateBody.uid, this.updateBody, this.user.ruolo !== this.updateBody.ruolo, !!this.updateBody.password);

      this.$store.commit(MutationTypes.SET_USER, {
        uid: this.updateBody.uid,
        nomeUtente: this.updateBody.nomeUtente as string,
        email: this.updateBody.email as string,
        ruolo: this.updateBody.ruolo,
        dataCreazione: this.user.dataCreazione,
      });
      this.resetUpdateBody();
    }
  }

  /* LIFE CYCLE */

  async created() {
    this.resetUpdateBody();
  }
}
</script>

<style lang="scss" scoped>
.utenti {
  height: 100%;
}
</style>
