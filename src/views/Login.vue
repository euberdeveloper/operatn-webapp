<template>
  <v-app id="inspire">
    <v-main>
      <div class="bg-opera"></div>
      <v-container class="fill-height" fluid="fluid">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark="dark" flat="flat">
                <v-toolbar-title>Login Portineria Opera</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form @keyup.native.enter="login()">
                  <v-text-field label="Login" name="login" v-model="input.username" prepend-icon="mdi-account" type="text"></v-text-field>
                  <v-text-field id="password" label="Password" name="password" v-model="input.password" prepend-icon="mdi-lock" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="login()">Login</v-btn>
              </v-card-actions>
              <v-alert v-if="alert" :value="!!this.alert" v-alert="v - alert" prominent="prominent" type="error" transition="slide-x-transition">{{ alert }}</v-alert>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data() {
    return {
      input: {
        username: "",
        password: "",
      },
      alert: false,
    };
  },
  methods: {
    async login() {
      if (this.input.username != "" && this.input.password != "") {
        try {
          await this.$store.dispatch("user/login", this.input);
          this.$router.replace("/");
        } catch (error) {
          this.alert = "Username o password errate";
        }
      } else {
        this.alert = "L'username e la password non possono essere vuoti";
      }
    },
  },
};
</script>

<style>
.bg-opera {
  background: url("../assets/bg_opera.jpeg") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 100%;
  width: 100%;
  filter: blur(12px);
  -webkit-filter: blur(12px);
  position: absolute;
}
</style>