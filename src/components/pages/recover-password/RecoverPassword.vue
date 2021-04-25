<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <div class="background" />

    <!-- LOGIN CONTAINER -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- LOGIN CARD WITH TRANSITION -->
          <v-scale-transition origin="center center">
            <v-card class="elevation-12" v-show="showCard">
              <!-- TITLE -->
              <v-toolbar color="primary" class="d-flex justify-center" dark flat>
                <v-toolbar-title>OperaTN - Recupero password</v-toolbar-title>
              </v-toolbar>
              <!-- CONTENT -->
              <v-card-text>
                <!-- LOADING -->
                <v-skeleton-loader class="mb-6" type="article, actions" v-if="fetching"></v-skeleton-loader>
                <!-- FORM -->
                <v-form @keyup.native.enter="recoverPassword()" v-model="formValid" v-else-if="utente">
                  <v-text-field
                    :type="passwordType"
                    label="Password"
                    name="password"
                    v-model="password"
                    :rules="[$validator.requiredText('Password'), $validator.password()]"
                    prepend-icon="mdi-lock"
                    :append-icon="passwordIcon"
                    @click:append="showPassword = !showPassword"
                  />
                  <v-text-field
                    :type="passwordType"
                    label="Conferma password"
                    name="password-confirmation"
                    v-model="passwordConfirmation"
                    :rules="[$validator.requiredText('Conferma password'), $validator.passwordsCoincide(password)]"
                    prepend-icon="mdi-lock-check"
                    :append-icon="passwordIcon"
                    @click:append="showPassword = !showPassword"
                  />
                </v-form>
                <!-- ERRORE -->
                <v-alert text outlined color="deep-orange" icon="mdi-cloud-alert" v-else> Token non valido </v-alert>
              </v-card-text>
              <!-- BUTTON -->
              <v-card-actions class="d-flex justify-center pb-4">
                <v-btn color="primary" large :disabled="!formValid" :loading="loading" @click="recoverPassword()" v-if="utente">CAMBIA PASSWORD</v-btn>
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { ActionTypes } from "@/store";
import { UtentiReturned } from "operatn-api-client/api/controllers/utenti/index";

@Component
export default class Login extends Vue {
  /* PROPS */
  @Prop({ type: String, required: true })
  token!: string;

  /* DATA */

  private fetching = false;
  private utente: UtentiReturned | null = null;

  private password: string | null = null;
  private passwordConfirmation: string | null = null;
  private showCard = false;
  private showPassword = false;

  private formValid = false;
  private loading = false;

  /* GETTERS AND SETTERS */

  get passwordType(): "text" | "password" {
    return this.showPassword ? "text" : "password";
  }
  get passwordIcon(): "mdi-eye" | "mdi-eye-off" {
    return this.showPassword ? "mdi-eye-off" : "mdi-eye";
  }

  /* METHODS */

  reset(): void {
    this.password = "";
    this.passwordConfirmation = "";
  }

  async recoverPassword(): Promise<void> {
    if (this.formValid && !this.loading) {
      try {
        this.loading = true;
        await this.$api.utenti.recoverPassword(this.token, { password: this.password as string });
        this.reset();
        this.$store.dispatch(ActionTypes.SHOW_SUCCESS_DIALOG, "Password cambiata correttamente. Premi sull'icona in basso a destra per andare al login");
      } catch (error) {
        if (error) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore nel cambiare la password");
        }
      } finally {
        this.loading = false;
      }
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    this.showCard = true;
    try {
      this.fetching = true;
     this.utente = await this.$api.utenti.getUserByRecoveryToken(this.token);
    } catch (error) {
    } finally {
      this.fetching = false;
    }
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
