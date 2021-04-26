<template>
  <operatn-base-resource-manager
    title="Tipi fabbricato"
    description="Gestione dei tipi fabbricato dell'opera. Attenzione, eliminare un tipo di fabbricato elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi fabbricato"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="tipiFabbricato"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo tipo fabbricato"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo fabbricato"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateTipoFabbricato"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateTipoFabbricato(true)"
    @createDialogCancel="closeCreateTipoFabbricato(false)"
    @editDialogConfirm="closeEditTipoFabbricato(true)"
    @editDialogCancel="closeEditTipoFabbricato(false)"
  >
    <template v-slot:createDialog>
      <operatn-tipo-fabbricato-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :tipiFabbricato="tipiFabbricato" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-fabbricato-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiFabbricato="tipiFabbricato"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoFabbricato } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoFabbricatoForm from "@/components/gears/forms/OperatnTipoFabbricatoForm.vue";
import { TipiFabbricatoCreateBody, TipiFabbricatoReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoFabbricatoForm,
  },
})
export default class TipiFabbricato extends Vue {
  /* DATA */
  private tipiFabbricato: TipoFabbricato[] = [];

  private selectedValues: TipoFabbricato[] = [];
  private backupItem: TipoFabbricato | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: TipiFabbricatoReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: TipiFabbricatoCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<TipoFabbricato>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo fabbricato",
        value: "tipoFabbricato",
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
            this.$validator.requiredText("Tipo fabbricato")
          ],
        },
      },
    ];
  }

  get actions(): Actions<TipoFabbricato> {
    return {
      onEdit: (item) => this.openEditTipoFabbricato(item),
      onDelete: (item) => this.askDeleteTipoFabbricato(item),
    };
  }

  /* METHODS */

  backup(item: TipoFabbricato): void {
    this.backupItem = { ...item };
  }

  async update(value: TipoFabbricato): Promise<void> {
    try {
      await this.$api.tipiFabbricato.replace(value.id, { tipoFabbricato: value.tipoFabbricato });
    } catch (error) {
      const index = this.tipiFabbricato.findIndex((t) => t.id === value.id);
      this.tipiFabbricato.splice(index, 1, this.backupItem as TipoFabbricato);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id tipo fabbricato non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del tipo fabbricato non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo fabbricato non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteTipoFabbricato(id: number): Promise<void> {
    try {
      await this.$api.tipiFabbricato.delete(id);
      const index = this.tipiFabbricato.findIndex((t) => t.id === id);
      this.tipiFabbricato.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid tipo fabbricato non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo fabbricato non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteTipoFabbricato(value: TipoFabbricato): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il tipo fabbricato ${value.tipoFabbricato}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteTipoFabbricato(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i tipi di fabbricato selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const tipoFabbricato of [...this.selectedValues]) {
            try {
              await this.deleteTipoFabbricato(tipoFabbricato.id);
              const index = this.selectedValues.findIndex((t) => t.id === tipoFabbricato.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateTipoFabbricato(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateTipoFabbricato(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.tipiFabbricato.create(this.createBody);

        this.tipiFabbricato.push({
          id,
          tipoFabbricato: this.createBody.tipoFabbricato,
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di fabbricato da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  openEditTipoFabbricato(tipoFabbricato: TipoFabbricato): void {
    this.updateBody = {
      tipoFabbricato: tipoFabbricato.tipoFabbricato,
    };
    this.updateId = tipoFabbricato.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(tipoFabbricato);
  }
  async closeEditTipoFabbricato(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.tipiFabbricato.replace(this.updateId as number, {
          tipoFabbricato: this.updateBody.tipoFabbricato,
        });

        const index = this.tipiFabbricato.findIndex((t) => t.id === this.updateId);
        this.tipiFabbricato.splice(index, 1, {
          id: this.updateId as number,
          tipoFabbricato: this.updateBody.tipoFabbricato,
        });

        this.updateBody = null;
        this.updateId = null;
        this.showEditDialog = false;
        this.backupItem = null;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di fabbricato da creare non validi`);
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
      this.tipiFabbricato = await this.$api.tipiFabbricato.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i tipi di fabbricato");
      }
    }
  }
}
</script>