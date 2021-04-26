<template>
  <operatn-base-resource-manager
    title="Quietanzianti"
    description="Gestione dei quietanzianti dell'opera. Attenzione, eliminare un quietanziante elimina a cascata tutti i contratti ad esso associati."
    tableTitle="Quietanzianti"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="quietanzianti"
    tableItemKey="id"
    tableShowSelect
    createDialogTitle="Nuovo quietanziante"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica quietanziante"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreateQuietanziante"
    @fabDeleteClick="askDeleteSelected"
    @createDialogConfirm="closeCreateQuietanziante(true)"
    @createDialogCancel="closeCreateQuietanziante(false)"
    @editDialogConfirm="closeEditQuietanziante(true)"
    @editDialogCancel="closeEditQuietanziante(false)"
  >
    <template v-slot:createDialog>
      <operatn-quietanziante-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :quietanzianti="quietanzianti" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-quietanziante-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :quietanzianti="quietanzianti"
        :backupValue="backupItem"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BadRequestError, InvalidBodyError, InvalidPathParamError, NotFoundError, Quietanziante } from "operatn-api-client";

import { ActionTypes } from "@/store";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnQuietanzianteForm from "@/components/gears/forms/OperatnQuietanzianteForm.vue";
import { QuietanziantiCreateBody, QuietanziantiReplaceBody } from "operatn-api-client/api/controllers/index";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnQuietanzianteForm,
  },
})
export default class Quietanzianti extends Vue {
  /* DATA */
  private quietanzianti: Quietanziante[] = [];

  private selectedValues: Quietanziante[] = [];
  private backupItem: Quietanziante | null = null;

  private showEditDialog = false;
  private updateBodyValid = false;
  private updateBody: QuietanziantiReplaceBody | null = null;
  private updateId: number | null = null;

  private showCreateDialog = false;
  private createBodyValid = false;
  private createBody: QuietanziantiCreateBody | null = null;

  /* GETTERS AND SETTERS */

  get columns(): Column<Quietanziante>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Quietanziante",
        value: "quietanziante",
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
            this.$validator.requiredText("Quietanziante")
          ],
        },
      },
    ];
  }

  get actions(): Actions<Quietanziante> {
    return {
      onEdit: (item) => this.openEditQuietanziante(item),
      onDelete: (item) => this.askDeleteQuietanziante(item),
    };
  }

  /* METHODS */

  backup(item: Quietanziante): void {
    this.backupItem = { ...item };
  }

  async update(value: Quietanziante): Promise<void> {
    try {
      await this.$api.quietanzianti.replace(value.id, { quietanziante: value.quietanziante });
    } catch (error) {
      const index = this.quietanzianti.findIndex((t) => t.id === value.id);
      this.quietanzianti.splice(index, 1, this.backupItem as Quietanziante);
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Id quietanziante non valido");
        } else if (error instanceof InvalidBodyError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati da aggiornare del quietanziante non validi`);
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Quietanziante non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  async deleteQuietanziante(id: number): Promise<void> {
    try {
      await this.$api.quietanzianti.delete(id);
      const index = this.quietanzianti.findIndex((t) => t.id === id);
      this.quietanzianti.splice(index, 1);
    } catch (error) {
      if (error) {
        if (error instanceof InvalidPathParamError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Uid quietanziante non valido");
        } else if (error instanceof NotFoundError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Quietanziante non trovato`);
        } else if (error instanceof BadRequestError) {
          this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida.`);
        }
      }
    }
  }

  askDeleteQuietanziante(value: Quietanziante): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare il quietanziante ${value.quietanziante}?`,
      callback: async (answer) => {
        if (answer) {
          await this.deleteQuietanziante(value.id);
        }
      },
    });
  }

  askDeleteSelected(): void {
    this.$store.dispatch(ActionTypes.SHOW_CONFIRM_DIALOG, {
      text: `Sei sicuro di voler eliminare i quietanzianti selezionati?`,
      callback: async (answer) => {
        if (answer) {
          for (const quietanziante of [...this.selectedValues]) {
            try {
              await this.deleteQuietanziante(quietanziante.id);
              const index = this.selectedValues.findIndex((t) => t.id === quietanziante.id);
              if (index !== undefined) {
                this.selectedValues.splice(index, 1);
              }
            } catch (error) {}
          }
        }
      },
    });
  }

  openCreateQuietanziante(): void {
    this.createBodyValid = false;
    this.showCreateDialog = true;
  }
  async closeCreateQuietanziante(save: boolean): Promise<void> {
    if (!save) {
      this.createBody = null;
      this.showCreateDialog = false;
      return;
    }

    if (this.createBodyValid && this.createBody) {
      try {
        const id = await this.$api.quietanzianti.create(this.createBody);

        this.quietanzianti.push({
          id,
          quietanziante: this.createBody.quietanziante,
        });

        this.createBody = null;
        this.showCreateDialog = false;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del quietanziante da creare non validi`);
          } else if (error instanceof BadRequestError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Richiesta non valida`);
          } else {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Errore del server`);
          }
        }
      }
    }
  }

  openEditQuietanziante(quietanziante: Quietanziante): void {
    this.updateBody = {
      quietanziante: quietanziante.quietanziante,
    };
    this.updateId = quietanziante.id;
    this.updateBodyValid = false;
    this.showEditDialog = true;
    this.backup(quietanziante);
  }
  async closeEditQuietanziante(save: boolean): Promise<void> {
    if (!save) {
      this.updateBody = null;
      this.updateId = null;
      this.showEditDialog = false;
      this.backupItem = null;
      return;
    }

    if (this.updateBodyValid && this.updateBody) {
      try {
        await this.$api.quietanzianti.replace(this.updateId as number, {
          quietanziante: this.updateBody.quietanziante,
        });

        const index = this.quietanzianti.findIndex((t) => t.id === this.updateId);
        this.quietanzianti.splice(index, 1, {
          id: this.updateId as number,
          quietanziante: this.updateBody.quietanziante,
        });

        this.updateBody = null;
        this.updateId = null;
        this.showEditDialog = false;
        this.backupItem = null;
      } catch (error) {
        if (error) {
          if (error instanceof InvalidBodyError) {
            this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, `Dati del quietanziante da creare non validi`);
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
      this.quietanzianti = await this.$api.quietanzianti.getAll();
    } catch (error) {
      if (error) {
        this.$store.dispatch(ActionTypes.SHOW_ERROR_DIALOG, "Errore: impossibile caricare i quietanzianti");
      }
    }
  }
}
</script>