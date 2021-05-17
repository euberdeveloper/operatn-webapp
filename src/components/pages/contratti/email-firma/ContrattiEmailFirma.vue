<template>
  <v-main>
    <!-- IMAGE OF BACKGROUND -->
    <div class="background" />

    <!-- CONTAINER -->
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- CARD WITH TRANSITION -->
          <v-scale-transition origin="center center">
            <v-card class="elevation-12" v-show="showCard">
              <!-- TITLE -->
              <v-toolbar color="primary" class="d-flex justify-center" dark flat>
                <v-toolbar-title>OperaTN - Invio contratto firmato</v-toolbar-title>
              </v-toolbar>
              <!-- CONTENT -->
              <v-card-text>
                <!-- LOADING -->
                <v-skeleton-loader class="mb-6" type="article, actions" v-if="fetching"></v-skeleton-loader>
                <!-- FORM -->
                <v-form @keyup.native.enter="uploadFile()" v-model="formValid" v-else-if="contratto">
                  <v-file-input v-model="file" label="Contratto firmato" accept="application/pdf"  :rules="[$validator.requiredText('Contratto firmato'), $validator.maxSize(2000000)]" chips show-size />
                </v-form>
                <!-- ERRORE -->
                <v-alert text outlined color="deep-orange" icon="mdi-cloud-alert" v-else> Token non valido </v-alert>
              </v-card-text>
              <!-- BUTTON -->
              <v-card-actions class="d-flex justify-center pb-4">
                <v-btn color="primary" large :disabled="!formValid" :loading="loading" @click="uploadFile()" v-if="contratto">INVIA CONTRATTO</v-btn>
              </v-card-actions>
            </v-card>
          </v-scale-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import { ActionTypes } from "@/store";
import { ContrattiReturned } from "operatn-api-client";

import ContrattoHandlerMixin from '@/mixins/handlers/ContrattoHandlerMixin';

@Component
export default class ContrattiEmailFirma extends Mixins(ContrattoHandlerMixin) {
  /* PROPS */
  @Prop({ type: String, required: true })
  token!: string;

  /* DATA */

  private fetching = false;
  private contratto: ContrattiReturned | null = null;

  private file: File | null = null;
  private showCard = false;

  private formValid = false;
  private loading = false;

  /* METHODS */

  reset(): void {
    this.file = null;
  }

  async uploadFile(): Promise<void> {
    if (this.formValid && !this.loading) {
      try {
        this.loading = true;
        const formData = new FormData();
        formData.append('contratto', this.file as File);
        await this.uploadContrattoFirmaFromEmail(this.token, formData);
        this.reset();
        this.$store.dispatch(ActionTypes.SHOW_SUCCESS_DIALOG, "Contratto inviato correttamente, il documento sarà visionato e confermato dai nostri operatori");
      } catch (error) {
        if (error) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore nell'inviare contratto");
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
      this.contratto = await this.getContrattoByToken(this.token);
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
