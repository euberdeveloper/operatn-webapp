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
                <v-toolbar-title>Login OperaTN</v-toolbar-title>
              </v-toolbar>
              <!-- FORM -->
              <v-card-text>
                <v-form @keyup.native.enter="login()" v-model="loginFormValid">
                  <v-text-field type="text" label="Username" name="username" :rules="[$validator.requiredText('Password')]" v-model="username" prepend-icon="mdi-account" />
                  <v-text-field
                    :type="passwordType"
                    label="Password"
                    name="password"
                    v-model="password"
                    :rules="[$validator.requiredText('Password')]"
                    prepend-icon="mdi-lock"
                    :append-icon="passwordIcon"
                    @click:append="showPassword = !showPassword"
                  />
                </v-form>
              </v-card-text>
              <!-- BUTTON -->
              <v-card-actions class="d-flex justify-center pb-4">
                <v-btn color="primary" large :disabled="!loginBodyValid" @click="login()">Login</v-btn>
              </v-card-actions>
              <v-alert v-if="false" :value="!!this.alert" v-alert="v - alert" prominent="prominent" type="error" transition="slide-x-transition">alert</v-alert>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthLoginBody } from "operatn-api-client/api/controllers/auth/index";
import { ActionTypes } from "@/store";


@Component
export default class Login extends Vue {
  /* DATA */

  private username: string | null = null;
  private password: string | null = null;
  private showCard = false;
  private showPassword = false;

  private loginFormValid = false;
  private loading = false;

  /* GETTERS AND SETTERS */

  get loginBody() {
    return {
      username: this.username,
      password: this.password,
    };
  }

  get loginBodyValid(): boolean {
    return !this.loading && this.loginFormValid;
  }

  get passwordType(): "text" | "password" {
    return this.showPassword ? "text" : "password";
  }
  get passwordIcon(): "mdi-eye" | "mdi-eye-off" {
    return this.showPassword ? "mdi-eye-off" : "mdi-eye";
  }

  get requestedRoute(): string {
    return (this.$route.query.requestedRoute as string) ?? '/';
  }

  /* METHODS */

  reset(): void {
    this.username = "";
    this.password = "";
  }

  async login(): Promise<void> {
    if (this.loginBodyValid) {
      try {
        this.loading = true;
        await this.$store.dispatch(ActionTypes.LOGIN, this.loginBody as AuthLoginBody);
        this.reset();
        this.$router.replace(this.requestedRoute);
      } catch (error) {
        if (error) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, 'Credenziali errate');
        }
      } finally {
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
.root {
  width: 100vw;
  height: 100vh;
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background: url("~@/assets/login/login_background.jpg") no-repeat center center fixed;
  background-size: cover;
  filter: blur(12px);
}
</style>
