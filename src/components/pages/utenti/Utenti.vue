<template>
  <v-card>
    <v-card-title class="headline primary white--text">Utenti</v-card-title>
    <v-card-text>
      <v-subheader class="px-0 mt-4 text-subtitle-1"
        >Gestione degli utenti che possono accedere a questa piattaforma. Attenzione, il tuo utente non viene viene visualizzato.</v-subheader
      >
    </v-card-text>
    <v-data-table
      v-model="selectedUtenti"
      :headers="headers"
      :items="utenti"
      item-key="uid"
      show-select
      sort-by="nomeUtente"
      :search="search"
      :group-by.sync="aggregateBy"
      class="elevation-1"
      multi-sort
    >
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

      <template v-slot:item.dataCreazione="{ value }">
        <span class="ml-3">{{ new Date(value).toLocaleString() }}</span>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small color="primary" class="mr-2" @click="openEditUtente(item)">mdi-pencil</v-icon>
        <v-icon small color="error" @click="askDeleteUtente(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <!-- PLUS FAB BUTTON -->
    <v-fab-transition v-if="!isSelecting" key="plus">
      <v-btn color="primary" @click="openCreateUtente" fab large fixed bottom right>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <!-- DELETE FAB BUTTON -->
    <v-fab-transition v-else key="delete">
      <v-btn color="error" @click="askDeleteSelected" fab large fixed bottom right>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-fab-transition>

    <!-- CREATE DIALOG -->
    <operatn-action-dialog
      title="Nuobo utente"
      v-model="showCreateDialog"
      :disabled="!createBodyValid"
      @cancel="closeCreateUtente(false)"
      @confirm="closeCreateUtente(true)"
    >
      <operatn-utente-create-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
    </operatn-action-dialog>

    <!-- EDIT DIALOG -->
    <operatn-action-dialog
      title="Modifica utente"
      v-model="showEditDialog"
      :disabled="!updateBodyValid"
      @cancel="closeEditUtente(false)"
      @confirm="closeEditUtente(true)"
    >
      <operatn-utente-edit-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :canChangePassword="isRoot" class="mt-6" />
    </operatn-action-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { DataTableHeader } from "vuetify";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, RuoloUtente, UniqueConstraintError, UniqueRootError } from "operatn-api-client";
import { UtentiCreateBody, UtentiReturned, UtentiUpdateBody, UtentiUpdateRuoloBody, UtentiUpdatePasswordBody } from "operatn-api-client/api/controllers/utenti/index";

import { ActionTypes } from "@/store";
import { getRoleIcon } from "@/utils";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnUtenteEditForm from "@/components/gears/forms/OperatnUtenteEditForm.vue";
import OperatnUtenteCreateForm from "@/components/gears/forms/OperatnUtenteCreateForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnUtenteEditForm,
    OperatnUtenteCreateForm,
  },
})
export default class Utenti extends Vue {
  /* DATA */
  private utenti: UtentiReturned[] = [];
  private search = "";
  private aggregateBy: string | null = null;

  private selectedUtenti: UtentiReturned[] = [];
  private backupItem: UtentiReturned | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: (UtentiUpdateBody & UtentiUpdateRuoloBody & UtentiUpdatePasswordBody & { uid: string }) | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: UtentiCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get isSelecting(): boolean {
    return this.selectedUtenti.length > 0;
  }

  get isRoot(): boolean {
    return this.$store.state.user?.ruolo === RuoloUtente.ROOT;
  }

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
        text: "Data creazione",
        value: "dataCreazione",
        groupable: false,
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
        } else if (error instanceof UniqueConstraintError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Ci deve essere uno ed un solo utente root`);
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
        } else if (error instanceof UniqueRootError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `L'utente root non può essere eliminato`);
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

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare gli utenti selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const utente of [...this.selectedUtenti]) {
            try {
              await this.deleteUtente(utente.uid);
              const index = this.selectedUtenti.findIndex((u) => u.uid === utente.uid);
              if (index !== undefined) {
                this.selectedUtenti.splice(index, 1);
              }
            } catch (error) {}
          }
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
          ruolo: this.createBody.ruolo,
          dataCreazione: new Date(),
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof UniqueRootError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Ci può essere un solo utente root`);
          } else if (error instanceof InvalidBodyError) {
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
      password: "",
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
      try {
        await this.$api.utenti.update(this.updateBody.uid, {
          nomeUtente: this.updateBody.nomeUtente,
          email: this.updateBody.email,
        });

        if (this.backupItem?.ruolo !== this.updateBody.ruolo) {
          await this.$api.utenti.changeRuolo(this.updateBody.uid, { ruolo: this.updateBody.ruolo });
        }

        if (this.updateBody.password) {
          await this.$api.utenti.changePassword(this.updateBody.uid, { password: this.updateBody.password });
        }

        const index = this.utenti.findIndex((u) => u.uid === this.updateBody?.uid);
        this.utenti.splice(index, 1, {
          uid: this.updateBody.uid,
          nomeUtente: this.updateBody.nomeUtente as string,
          email: this.updateBody.email as string,
          ruolo: this.updateBody.ruolo,
          dataCreazione: this.backupItem?.dataCreazione as Date,
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
      const utenti = await this.$api.utenti.getAll();
      this.utenti = utenti.filter((u) => u.uid !== this.$store.state.user?.uid);
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
