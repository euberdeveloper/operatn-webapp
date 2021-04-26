<template>
  <operatn-base-resource-manager
    title="Tipi tariffa"
    description="Gestione dei tipi tariffa dell'opera. Attenzione, eliminare un tipo di tariffa elimina a cascata tutti i tariffe ed i contratti ad esso associati."
    tableTitle="Tipi tariffa"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="tipiTariffa"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo tipo tariffa"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo tariffa"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateTipoTariffa"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateTipoTariffa(true)"
    @createDialogCancel="closeCreateTipoTariffa(false)"
    @editDialogConfirm="closeEditTipoTariffa(true)"
    @editDialogCancel="closeEditTipoTariffa(false)"
  >
    <template v-slot:createDialog>
      <operatn-tipo-tariffa-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :tipiTariffa="tipiTariffa" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-tariffa-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiTariffa="tipiTariffa"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, TipoTariffa } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoTariffaForm from "@/components/gears/forms/OperatnTipoTariffaForm.vue";
import { TipiTariffaCreateBody, TipiTariffaReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoTariffaForm,
  },
})
export default class TipiTariffa extends Vue {
  /* DATA */
  private tipiTariffa: TipoTariffa[] = [];

  private selectedValues: TipoTariffa[] = [];
  private backupItem: TipoTariffa | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: TipiTariffaReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: TipiTariffaCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<TipoTariffa>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo tariffa",
        value: "tipoTariffa",
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
            this.$validator.requiredText("Tipo tariffa")
          ],
        },
      },
    ];
  }

  get actions(): Actions<TipoTariffa> {
    return {
      onEdit: (item) => this.openEditTipoTariffa(item),
      onDelete: (item) => this.askDeleteTipoTariffa(item),
    };
  }

  /* METHODS */

  backup(item: TipoTariffa): void {
    this.backupItem = { ...item };
  }

  async update(value: TipoTariffa): Promise<void> {
    try {
      await this.$api.tipiTariffa.replace(value.id, { tipoTariffa: value.tipoTariffa });
    } catch (error) {
      const index = this.tipiTariffa.findIndex((t) => t.id === value.id);
      this.tipiTariffa.splice(index, 1, this.backupItem as TipoTariffa);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id tipo tariffa non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del tipo tariffa non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo tariffa non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteTipoTariffa(id: number): Promise<void> {
    try {
      await this.$api.tipiTariffa.delete(id);
      const index = this.tipiTariffa.findIndex((t) => t.id === id);
      this.tipiTariffa.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid tipo tariffa non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Tipo tariffa non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteTipoTariffa(value: TipoTariffa): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il tipo tariffa ${value.tipoTariffa}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteTipoTariffa(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i tipi di tariffa selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const tipoTariffa of [...this.selectedValues]) {
            try {
              await this.deleteTipoTariffa(tipoTariffa.id);
              const index = this.selectedValues.findIndex((t) => t.id === tipoTariffa.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateTipoTariffa(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateTipoTariffa(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.tipiTariffa.create(this.createBody);

        this.tipiTariffa.push({
          id,
          tipoTariffa: this.createBody.tipoTariffa,
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di tariffa da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  openEditTipoTariffa(tipoTariffa: TipoTariffa): void {
    this.updateBody = {
      tipoTariffa: tipoTariffa.tipoTariffa,
    };
    this.updateId = tipoTariffa.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(tipoTariffa);
  }
  async closeEditTipoTariffa(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.tipiTariffa.replace(this.updateId as number, {
          tipoTariffa: this.updateBody.tipoTariffa,
        });

        const index = this.tipiTariffa.findIndex((t) => t.id === this.updateId);
        this.tipiTariffa.splice(index, 1, {
          id: this.updateId as number,
          tipoTariffa: this.updateBody.tipoTariffa,
        });

        this.updateBody = null;
        this.updateId = null;
        this.showEditDialog = false;
        this.backupItem = null;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del tipo di tariffa da creare non validi`);
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
      this.tipiTariffa = await this.$api.tipiTariffa.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i tipi di tariffa");
      }
    }
  }
}
</script>