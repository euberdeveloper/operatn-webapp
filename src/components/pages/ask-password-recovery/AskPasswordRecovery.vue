<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <div class="background" />

    <!-- RECOVERY CONTAINER -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- RECOVERY CARD WITH TRANSITION -->
          <v-scale-transition origin="center center">
            <v-card class="elevation-12" v-show="showCard">
              <!-- TITLE -->
              <v-toolbar color="primary" class="d-flex justify-center" dark flat>
                <v-toolbar-title>OperaTN - Richiedi recupero password</v-toolbar-title>
              </v-toolbar>
              <!-- FORM -->
              <v-card-text>
                <v-form @keyup.native.enter="askPasswordRecovery()" v-model="formValid">
                  <v-text-field
                    type="text"
                    label="Username"
                    name="username"
                    :rules="[$validator.requiredText('Username')]"
                    v-model="username"
                    prepend-icon="mdi-account"
                  />
                </v-form>
              </v-card-text>
              <!-- BUTTON -->
              <v-card-actions class="d-flex justify-center pb-4">
                <v-btn color="primary" large :disabled="!formValid" :loading="loading" @click="askPasswordRecovery()">RICHIEDI</v-btn>
                <div class="help">
                  <v-tooltip left nudge-top="15" nudge-right="7">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" v-on="on" v-bind="attrs" to="/login" icon small><v-icon>mdi-key-variant</v-icon></v-btn>
                    </template>
                    <span>Login</span>
                  </v-tooltip>
                </div>
              </v-card-actions>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ActionTypes } from "@/store";
import { NotFoundError } from "operatn-api-client";

@Component
export default class AskPasswordRecovery extends Vue {
  /* DATA */

  private loading = false;
  private username: string | null = null;
  private showCard = false;
  private formValid = false;

  /* METHODS */

  reset(): void {
    this.username = "";
  }

  async askPasswordRecovery(): Promise<void> {
    if (this.formValid && !this.loading) {
      try {
        this.loading = true;
        await this.$api.utenti.askPasswordRecovery(this.username as string);
        this.reset();
        this.$store.dispatch(ActionTypes.SHOW_SUCCESS_DIALOG, "Ti è stata inviata una email per recuperare la password dell'utente");
      } catch (error) {
        if (error) {
          if (error instanceof NotFoundError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Utente non trovato");
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore nel server");
          }
        }
      }
      finally {
        this.loading = false;
      }
    }
  }

  /* LIFE CYCLE */

  mounted() {
    this.showCard = true;
  }
}
</script>

<style lang="scss" scoped>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: url("~@/assets/opera_background.jpg") no-repeat center center fixed;
  background-size: cover;
  filter: blur(12px);
}

.help {
  position: absolute;
  bottom: 4px;
  right: 4px;
}
</style>
