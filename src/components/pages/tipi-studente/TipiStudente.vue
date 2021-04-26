<template>
  <operatn-base-resource-manager
    title="Tipi studente"
    description="Gestione dei tipi studente dell'opera. Attenzione, eliminare un tipo di studente elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi studente"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="tipiStudente"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo tipo studente"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo studente"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateTipoStudente"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateTipoStudente(true)"
    @createDialogCancel="closeCreateTipoStudente(false)"
    @editDialogConfirm="closeEditTipoStudente(true)"
    @editDialogCancel="closeEditTipoStudente(false)"
  >
    <template v-slot:createDialog>
      <operatn-tipo-studente-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :tipiStudente="tipiStudente" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-studente-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiStudente="tipiStudente"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoStudente } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoStudenteForm from "@/components/gears/forms/OperatnTipoStudenteForm.vue";
import { TipiStudenteCreateBody, TipiStudenteReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoStudenteForm,
  },
})
export default class TipiStudente extends Vue {
  /* DATA */
  private tipiStudente: TipoStudente[] = [];

  private selectedValues: TipoStudente[] = [];
  private backupItem: TipoStudente | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: TipiStudenteReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: TipiStudenteCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<TipoStudente>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo studente",
        value: "tipoStudente",
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
            this.$validator.requiredText("Tipo studente")
          ],
        },
      },
    ];
  }

  get actions(): Actions<TipoStudente> {
    return {
      onEdit: (item) => this.openEditTipoStudente(item),
      onDelete: (item) => this.askDeleteTipoStudente(item),
    };
  }

  /* METHODS */

  backup(item: TipoStudente): void {
    this.backupItem = { ...item };
  }

  async update(value: TipoStudente): Promise<void> {
    try {
      await this.$api.tipiStudente.replace(value.id, { tipoStudente: value.tipoStudente });
    } catch (error) {
      const index = this.tipiStudente.findIndex((t) => t.id === value.id);
      this.tipiStudente.splice(index, 1, this.backupItem as TipoStudente);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id tipo studente non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del tipo studente non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo studente non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteTipoStudente(id: number): Promise<void> {
    try {
      await this.$api.tipiStudente.delete(id);
      const index = this.tipiStudente.findIndex((t) => t.id === id);
      this.tipiStudente.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid tipo studente non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo studente non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteTipoStudente(value: TipoStudente): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il tipo studente ${value.tipoStudente}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteTipoStudente(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i tipi di studente selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const tipoStudente of [...this.selectedValues]) {
            try {
              await this.deleteTipoStudente(tipoStudente.id);
              const index = this.selectedValues.findIndex((t) => t.id === tipoStudente.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateTipoStudente(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateTipoStudente(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.tipiStudente.create(this.createBody);

        this.tipiStudente.push({
          id,
          tipoStudente: this.createBody.tipoStudente,
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

  openEditTipoStudente(tipoStudente: TipoStudente): void {
    this.updateBody = {
      tipoStudente: tipoStudente.tipoStudente,
    };
    this.updateId = tipoStudente.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(tipoStudente);
  }
  async closeEditTipoStudente(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.tipiStudente.replace(this.updateId as number, {
          tipoStudente: this.updateBody.tipoStudente,
        });

        const index = this.tipiStudente.findIndex((t) => t.id === this.updateId);
        this.tipiStudente.splice(index, 1, {
          id: this.updateId as number,
          tipoStudente: this.updateBody.tipoStudente,
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
      this.tipiStudente = await this.$api.tipiStudente.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i tipi di studente");
      }
    }
  }
}
</script>