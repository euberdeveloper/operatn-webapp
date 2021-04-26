<template>
  <operatn-base-resource-manager
    title="Conti ricavi e canoni"
    description="Gestione dei conti ricavi e canoni dell'opera. Attenzione, eliminare un conto ricavi e canoni elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Conti ricavi e canoni"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="contiRicaviCanoni"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo conto ricavi e canoni"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica conto ricavi e canoni"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateContoRicaviCanoni"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateContoRicaviCanoni(true)"
    @createDialogCancel="closeCreateContoRicaviCanoni(false)"
    @editDialogConfirm="closeEditContoRicaviCanoni(true)"
    @editDialogCancel="closeEditContoRicaviCanoni(false)"
  >
    <template v-slot:createDialog>
      <operatn-conto-ricavi-canoni-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :contiRicaviCanoni="contiRicaviCanoni" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-conto-ricavi-canoni-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :contiRicaviCanoni="contiRicaviCanoni"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, ContoRicaviCanoni } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContoRicaviCanoniForm from "@/components/gears/forms/OperatnContoRicaviCanoniForm.vue";
import { ContiRicaviCanoniCreateBody, ContiRicaviCanoniReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContoRicaviCanoniForm,
  },
})
export default class ContiRicaviCanoni extends Vue {
  /* DATA */
  private contiRicaviCanoni: ContoRicaviCanoni[] = [];

  private selectedValues: ContoRicaviCanoni[] = [];
  private backupItem: ContoRicaviCanoni | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: ContiRicaviCanoniReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: ContiRicaviCanoniCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<ContoRicaviCanoni>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Codice",
        value: "codice",
        groupable: false,

        editable: true,
        onEditSave: (item) => this.update(item),
        onEditOpen: (item) => this.backup(item),
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [
            this.$validator.requiredText("Codice")
          ],
        },
      },
      {
        text: "Conto ricavi e canoni",
        value: "contoRicaviCanoni",
        groupable: false,

        editable: true,
        onEditSave: (item) => this.update(item),
        onEditOpen: (item) => this.backup(item),
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [
            this.$validator.requiredText("Conto ricavi e canoni")
          ],
        },
      },
    ];
  }

  get actions(): Actions<ContoRicaviCanoni> {
    return {
      onEdit: (item) => this.openEditContoRicaviCanoni(item),
      onDelete: (item) => this.askDeleteContoRicaviCanoni(item),
    };
  }

  /* METHODS */

  backup(item: ContoRicaviCanoni): void {
    this.backupItem = { ...item };
  }

  async update(value: ContoRicaviCanoni): Promise<void> {
    try {
      await this.$api.contiRicaviCanoni.replace(value.id, { 
        codice: value.codice,
        contoRicaviCanoni: value.contoRicaviCanoni 
        });
    } catch (error) {
      const index = this.contiRicaviCanoni.findIndex((t) => t.id === value.id);
      this.contiRicaviCanoni.splice(index, 1, this.backupItem as ContoRicaviCanoni);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id conto ricavi e canoni non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del conto ricavi e canoni non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Conto ricavi e canoni non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteContoRicaviCanoni(id: number): Promise<void> {
    try {
      await this.$api.contiRicaviCanoni.delete(id);
      const index = this.contiRicaviCanoni.findIndex((t) => t.id === id);
      this.contiRicaviCanoni.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid conto ricavi e canoni non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Conto ricavi e canoni non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteContoRicaviCanoni(value: ContoRicaviCanoni): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il conto ricavi e canoni ${value.contoRicaviCanoni}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteContoRicaviCanoni(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i tipi di studente selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const contoRicaviCanoni of [...this.selectedValues]) {
            try {
              await this.deleteContoRicaviCanoni(contoRicaviCanoni.id);
              const index = this.selectedValues.findIndex((t) => t.id === contoRicaviCanoni.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateContoRicaviCanoni(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateContoRicaviCanoni(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.contiRicaviCanoni.create(this.createBody);

        this.contiRicaviCanoni.push({
          id,
          codice: this.createBody.codice,
          contoRicaviCanoni: this.createBody.contoRicaviCanoni,
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di studente da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  openEditContoRicaviCanoni(contoRicaviCanoni: ContoRicaviCanoni): void {
    this.updateBody = {
      codice: contoRicaviCanoni.codice,
      contoRicaviCanoni: contoRicaviCanoni.contoRicaviCanoni,
    };
    this.updateId = contoRicaviCanoni.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(contoRicaviCanoni);
  }
  async closeEditContoRicaviCanoni(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.contiRicaviCanoni.replace(this.updateId as number, {
          codice: this.updateBody.codice,
          contoRicaviCanoni: this.updateBody.contoRicaviCanoni,
        });

        const index = this.contiRicaviCanoni.findIndex((t) => t.id === this.updateId);
        this.contiRicaviCanoni.splice(index, 1, {
          id: this.updateId as number,
          codice: this.updateBody.codice,
          contoRicaviCanoni: this.updateBody.contoRicaviCanoni,
        });

        this.updateBody = null;
        this.updateId = null;
        this.showEditDialog = false;
        this.backupItem = null;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di studente da creare non validi`);
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
      this.contiRicaviCanoni = await this.$api.contiRicaviCanoni.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i tipi di studente");
      }
    }
  }
}
</script>