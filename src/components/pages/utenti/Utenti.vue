<template>
  <operatn-base-resource-manager
    title="Utenti"
    description="Gestione degli utenti che possono accedere a questa piattaforma. Attenzione, il tuo utente non viene viene visualizzato."
    tableTitle="Utenti"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="utenti"
    tableItemKey="uid"
    tableSortBy="nome"
    tableShowSelect
    tableMultiSort
    createDialogTitle="Nuovo utente"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica utente"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateUtente"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateUtente(true)"
    @createDialogCancel="closeCreateUtente(false)"
    @editDialogConfirm="closeEditUtente(true)"
    @editDialogCancel="closeEditUtente(false)"
  >
    <template v-slot:createDialog>
      <operatn-utente-create-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-utente-edit-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :canChangePassword="isRoot" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, RuoloUtente, UniqueConstraintError, UniqueRootError } from "operatn-api-client";
import { UtentiCreateBody, UtentiReturned, UtentiUpdateBody, UtentiUpdateRuoloBody, UtentiUpdatePasswordBody } from "operatn-api-client/api/controllers/utenti/index";

import { ActionTypes } from "@/store";
import { getRoleIcon } from "@/utils";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnUtenteEditForm from "@/components/gears/forms/OperatnUtenteEditForm.vue";
import OperatnUtenteCreateForm from "@/components/gears/forms/OperatnUtenteCreateForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnUtenteEditForm,
    OperatnUtenteCreateForm,
  },
})
export default class Utenti extends Vue {
  /* DATA */
  private utenti: UtentiReturned[] = [];

  private selectedValues: UtentiReturned[] = [];
  private backupItem: UtentiReturned | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: (UtentiUpdateBody & UtentiUpdateRuoloBody & UtentiUpdatePasswordBody & { uid: string }) | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: UtentiCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get isRoot(): boolean {
    return this.$store.state.user?.ruolo === RuoloUtente.ROOT;
  }

  get columns(): Column<UtentiReturned>[] {
    return [
      {
        text: "Nome utente",
        align: "start",
        value: "nomeUtente",
        groupable: false,

        editable: true,
        onEditSave: (item) => this.update(item),
        onEditOpen: (item) => this.backup(item),
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Nome utente"), this.$validator.nomeUtente()],
        },
      },
      {
        text: "Email",
        value: "email",
        groupable: false,

        editable: true,
        onEditSave: (item) => this.update(item),
        onEditOpen: (item) => this.backup(item),
        editInput: {
          type: "email",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Email"), this.$validator.email()],
        },
      },
      {
        text: "Ruolo",
        value: "ruolo",
        groupable: true,
        filterable: false,

        editable: true,
        onEditSave: (item) => this.update(item),
        onEditOpen: (item) => this.backup(item),
        editInput: {
          type: "select",
          label: "Modifica",
          hint: "Premi invio per salvare",
          rules: [this.$validator.requiredText("Ruolo"), this.$validator.ruoloUtente()],
          items: this.$store.state.roles,
        },
        itemText: true,
        itemIcon: true,
        itemIconHandler: (value: string) => getRoleIcon(value) ?? "",
      },
      {
        text: "Data creazione",
        value: "dataCreazione",
        groupable: false,
        filterable: false,

        editable: false,
        itemTextHandler: (value: string) => new Date(value).toLocaleString(),
      },
    ];
  }

  get actions(): Actions<UtentiReturned> {
    return {
      onEdit: (item) => this.openEditUtente(item),
      onDelete: (item) => this.askDeleteUtente(item),
    };
  }

  /* METHODS */

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
          for (const utente of [...this.selectedValues]) {
            try {
              await this.deleteUtente(utente.uid);
              const index = this.selectedValues.findIndex((u) => u.uid === utente.uid);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
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