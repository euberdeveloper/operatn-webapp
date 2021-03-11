<template>
<v-app id="inspire">
    <v-main>
        <v-container class="fill-height" fluid="">
            <v-row align="center" justify="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card class="elevation-12">
                        <v-toolbar color="primary" dark="" flat="">
                            <v-toolbar-title>404</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>Il percorso che ha inserito non esiste!</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="goHome">Torna all'home</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</v-app>

</template>
<script>
export default {
  methods: {
    goHome() {
      this.$router.replace('/')
    }
  },
}
</script>