<template>
  <operatn-base-resource-manager
    title="Conti ricavi e consumi"
    description="Gestione dei conti ricavi e consumi dell'opera. Attenzione, eliminare un conto ricavi e consumi elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Conti ricavi e consumi"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="contiRicaviConsumi"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo conto ricavi e consumi"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica conto ricavi e consumi"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateContoRicaviConsumi"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateContoRicaviConsumi(true)"
    @createDialogCancel="closeCreateContoRicaviConsumi(false)"
    @editDialogConfirm="closeEditContoRicaviConsumi(true)"
    @editDialogCancel="closeEditContoRicaviConsumi(false)"
  >
    <template v-slot:createDialog>
      <operatn-conto-ricavi-consumi-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :contiRicaviConsumi="contiRicaviConsumi" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-conto-ricavi-consumi-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :contiRicaviConsumi="contiRicaviConsumi"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, ContoRicaviConsumi } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContoRicaviConsumiForm from "@/components/gears/forms/OperatnContoRicaviConsumiForm.vue";
import { ContiRicaviConsumiCreateBody, ContiRicaviConsumiReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContoRicaviConsumiForm,
  },
})
export default class ContiRicaviConsumi extends Vue {
  /* DATA */
  private contiRicaviConsumi: ContoRicaviConsumi[] = [];

  private selectedValues: ContoRicaviConsumi[] = [];
  private backupItem: ContoRicaviConsumi | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: ContiRicaviConsumiReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: ContiRicaviConsumiCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<ContoRicaviConsumi>[] {
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
        text: "Conto ricavi e consumi",
        value: "contoRicaviConsumi",
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
            this.$validator.requiredText("Conto ricavi e consumi")
          ],
        },
      },
    ];
  }

  get actions(): Actions<ContoRicaviConsumi> {
    return {
      onEdit: (item) => this.openEditContoRicaviConsumi(item),
      onDelete: (item) => this.askDeleteContoRicaviConsumi(item),
    };
  }

  /* METHODS */

  backup(item: ContoRicaviConsumi): void {
    this.backupItem = { ...item };
  }

  async update(value: ContoRicaviConsumi): Promise<void> {
    try {
      await this.$api.contiRicaviConsumi.replace(value.id, { 
        codice: value.codice,
        contoRicaviConsumi: value.contoRicaviConsumi 
        });
    } catch (error) {
      const index = this.contiRicaviConsumi.findIndex((t) => t.id === value.id);
      this.contiRicaviConsumi.splice(index, 1, this.backupItem as ContoRicaviConsumi);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id conto ricavi e consumi non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del conto ricavi e consumi non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Conto ricavi e consumi non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteContoRicaviConsumi(id: number): Promise<void> {
    try {
      await this.$api.contiRicaviConsumi.delete(id);
      const index = this.contiRicaviConsumi.findIndex((t) => t.id === id);
      this.contiRicaviConsumi.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid conto ricavi e consumi non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Conto ricavi e consumi non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteContoRicaviConsumi(value: ContoRicaviConsumi): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il conto ricavi e consumi ${value.contoRicaviConsumi}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteContoRicaviConsumi(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i tipi di studente selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const contoRicaviConsumi of [...this.selectedValues]) {
            try {
              await this.deleteContoRicaviConsumi(contoRicaviConsumi.id);
              const index = this.selectedValues.findIndex((t) => t.id === contoRicaviConsumi.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateContoRicaviConsumi(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateContoRicaviConsumi(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.contiRicaviConsumi.create(this.createBody);

        this.contiRicaviConsumi.push({
          id,
          codice: this.createBody.codice,
          contoRicaviConsumi: this.createBody.contoRicaviConsumi,
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

  openEditContoRicaviConsumi(contoRicaviConsumi: ContoRicaviConsumi): void {
    this.updateBody = {
      codice: contoRicaviConsumi.codice,
      contoRicaviConsumi: contoRicaviConsumi.contoRicaviConsumi,
    };
    this.updateId = contoRicaviConsumi.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(contoRicaviConsumi);
  }
  async closeEditContoRicaviConsumi(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.contiRicaviConsumi.replace(this.updateId as number, {
          codice: this.updateBody.codice,
          contoRicaviConsumi: this.updateBody.contoRicaviConsumi,
        });

        const index = this.contiRicaviConsumi.findIndex((t) => t.id === this.updateId);
        this.contiRicaviConsumi.splice(index, 1, {
          id: this.updateId as number,
          codice: this.updateBody.codice,
          contoRicaviConsumi: this.updateBody.contoRicaviConsumi,
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
      this.contiRicaviConsumi = await this.$api.contiRicaviConsumi.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i tipi di studente");
      }
    }
  }
}
</script>