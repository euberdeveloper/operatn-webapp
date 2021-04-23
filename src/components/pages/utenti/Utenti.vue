<template>
  <v-card>
    <v-card-title class="headline primary white--text">Utenti</v-card-title>
    <v-card-text>
      <v-subheader class="px-0 mt-4 text-subtitle-1">Gestione degli utenti che possono accedere a questa piattaforma.</v-subheader>
    </v-card-text>
    <v-data-table :headers="headers" :items="utenti" item-key="uid" sort-by="nomeUtente" :search="search" :group-by.sync="aggregateBy" class="elevation-1" multi-sort>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Utenti</v-toolbar-title>
          <v-spacer />
          <v-container class="pa-0 fill-height">
            <v-text-field v-model="search" label="Cerca" dense solo outlined clearable hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
          </v-container>
        </v-toolbar>
      </template>

      <template v-slot:header.ruolo="{ header }">
        <span>{{ header.text }}</span>
        <v-btn icon x-small title="aggrega" @click="aggregateBy = header.value" class="ml-1">
          <v-icon x-small>mdi-layers-triple</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.nomeUtente="{ item, header, value }">
        <v-edit-dialog :return-value.sync="item[header.value]" :large="$vuetify.breakpoint.xs" @save="update(item)" @open="backup(item)">
          {{ value }}
          <template v-slot:input>
            <v-text-field
              class="mb-4"
              v-model="item[header.value]"
              label="Modifica"
              hint="Premi invio per salvare"
              :rules="[$validator.requiredText('nomeUtente'), $validator.nomeUtente()]"
              single-line
              counter
            />
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.email="{ item, header, value }">
        <v-edit-dialog :return-value.sync="item[header.value]" :large="$vuetify.breakpoint.xs" @save="update(item)" @open="backup(item)">
          {{ value }}
          <template v-slot:input>
            <v-text-field
              class="mb-4"
              v-model="item[header.value]"
              label="Modifica"
              hint="Premi invio per salvare"
              :rules="[$validator.requiredText('nomeUtente'), $validator.email()]"
              single-line
              counter
            />
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.ruolo="{ item, header, value }">
        <v-edit-dialog :return-value.sync="item[header.value]" :large="$vuetify.breakpoint.xs" @save="updateRole(item)" @open="backup(item)">
          <v-icon>{{ getRoleIcon(value) }}</v-icon>
          <span class="ml-3">{{ value }}</span>
          <template v-slot:input>
            <v-select class="mb-4" v-model="item[header.value]" label="Modifica" hint="Premi invio per salvare" :items="$store.state.roles" single-line />
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small color="primary" class="mr-2" @click="openEditUtente(item)">mdi-pencil</v-icon>
        <v-icon small color="error" @click="askDeleteUtente(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- PLUS FAB BUTTON -->
    <v-fab-transition>
      <v-btn color="primary" @click="openCreateUtente" fab large fixed bottom right>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>

    <!-- CREATE DIALOG -->
    <v-dialog v-model="showCreateDialog" persistent width="50vw">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Nuovo utente</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <operatn-utente-create-form v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn large color="error" @click="closeCreateUtente(false)">
            ANNULLA
            <v-icon right dark>mdi-cancel</v-icon>
          </v-btn>
          <v-btn large color="primary" @click="closeCreateUtente(true)" :disabled="!createBodyValid">SALVA<v-icon right dark>mdi-content-save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- EDIT DIALOG -->
    <v-dialog v-model="showEditDialog" persistent width="50vw">
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Modifica utente</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <operatn-utente-edit-form v-model="updateBody" :formValid.sync="updateBodyValid" class="mt-6" />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn large color="error" @click="closeEditUtente(false)">
            ANNULLA
            <v-icon right dark>mdi-cancel</v-icon>
          </v-btn>
          <v-btn large color="primary" @click="closeEditUtente(true)" :disabled="!updateBodyValid">SALVA<v-icon right dark>mdi-content-save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError } from "operatn-api-client";
import { UtentiCreateBody, UtentiReturned, UtentiUpdateBody, UtentiUpdateRuoloBody } from "operatn-api-client/api/controllers/utenti/index";

import { ActionTypes } from "@/store";
import { getRoleIcon } from "@/utils";

import OperatnUtenteEditForm from "@/components/gears/OperatnUtenteEditForm.vue";
import OperatnUtenteCreateForm from "@/components/gears/OperatnUtenteCreateForm.vue";


@Component({
  components: {
    OperatnUtenteEditForm,
    OperatnUtenteCreateForm
  },
})
export default class Utenti extends Vue {
  /* DATA */
  private utenti: UtentiReturned[] = [];
  private search = "";
  private aggregateBy: string | null = null;
  private backupItem: UtentiReturned | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: (UtentiUpdateBody & UtentiUpdateRuoloBody & { uid: string }) | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: UtentiCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get headers(): DataTableHeader[] {
    return [
      {
        text: "Nome utente",
        align: "start",
        value: "nomeUtente",
        groupable: false,
      },
      {
        text: "Email",
        value: "email",
        groupable: false,
      },
      {
        text: "Ruolo",
        value: "ruolo",
        groupable: true,
        filterable: false,
      },
      {
        text: "Azioni",
        value: "actions",
        sortable: false,
      },
    ];
  }

  /* METHODS */

  getRoleIcon(role: string): string | null {
    return getRoleIcon(role);
  }

  backup(item: UtentiReturned): void {
    this.backupItem = { ...item };
  }

  async update(value: UtentiReturned): Promise<void> {
    try {
      await this.$api.utenti.update(value.uid, {
        nomeUtente: value.nomeUtente,
        email: value.email,
      });
    } catch (error) {
      const index = this.utenti.findIndex((u) => u.uid === value.uid);
      this.utenti.splice(index, 1, this.backupItem as UtentiReturned);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid utente non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare dell'utente non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Utente non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async updateRole(value: UtentiReturned): Promise<void> {
    try {
      await this.$api.utenti.changeRuolo(value.uid, { ruolo: value.ruolo });
    } catch (error) {
      const index = this.utenti.findIndex((u) => u.uid === value.uid);
      this.utenti.splice(index, 1, this.backupItem as UtentiReturned);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid utente non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare dell'utente non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Utente non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteUtente(uid: string): Promise<void> {
    try {
      await this.$api.utenti.delete(uid);
      const index = this.utenti.findIndex((u) => u.uid === uid);
      this.utenti.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid utente non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Utente non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteUtente(value: UtentiReturned): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare l'utente ${value.nomeUtente}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteUtente(value.uid);
        }
      },
    });
  }

  openCreateUtente(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateUtente(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {

      try {
        const uid = await this.$api.utenti.create(this.createBody);

        this.utenti.push({
          uid,
          nomeUtente: this.createBody.nomeUtente,
          email: this.createBody.email,
          ruolo: this.createBody.ruolo
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati dell'utente da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  openEditUtente(utente: UtentiReturned): void {
    this.updateBody = {
      uid: utente.uid,
      nomeUtente: utente.nomeUtente,
      email: utente.email,
      ruolo: utente.ruolo,
    };
    this.backupItem = utente;
    this.updateBodyValid = false;
    this.showEditDialog = true;
  }
  async closeEditUtente(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {

      console.log('entrà')
      try {
        await this.$api.utenti.update(this.updateBody.uid, {
          nomeUtente: this.updateBody.nomeUtente,
          email: this.updateBody.email,
        });

        if (this.backupItem?.ruolo !== this.updateBody.ruolo) {
          await this.$api.utenti.changeRuolo(this.updateBody.uid, { ruolo: this.updateBody.ruolo });
        }

        const index = this.utenti.findIndex((u) => u.uid === this.updateBody?.uid);
        this.utenti.splice(index, 1, {
          uid: this.updateBody.uid,
          nomeUtente: this.updateBody.nomeUtente as string,
          email: this.updateBody.email as string,
          ruolo: this.updateBody.ruolo,
        });

        this.updateBody = null;
        this.showEditDialog = false;
        this.backupItem = null;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati dell'utente da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    try {
      this.utenti = await this.$api.utenti.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare gli utenti");
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.utenti {
  height: 100%;
}
</style>
