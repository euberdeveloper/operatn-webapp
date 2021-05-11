<template>
  <operatn-base-resource-manager
    title="Conti ricavi"
    description="Gestione dei conti ricavi dell'opera. Attenzione, eliminare un conto ricavi elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Conti ricavi"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableSortBy="codice"
    createDialogTitle="Nuovo conto ricavi"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica conto ricavi"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    @fabCreateClick="openCreate"
    @fabDeleteClick="askDeleteMultiple"
    @createDialogConfirm="closeCreate(true)"
    @createDialogCancel="closeCreate(false)"
    @editDialogConfirm="closeEdit(true)"
    @editDialogCancel="closeEdit(false)"
  >
    <template v-slot:createDialog>
      <operatn-conto-ricavi-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :contiRicaviValues="contiRicaviValues"
        :contiRicaviCodici="contiRicaviCodici"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-conto-ricavi-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :contiRicaviValues="contiRicaviValues"
        :contiRicaviCodici="contiRicaviCodici"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { ContoRicavi, ContiRicaviCreateBody, ContiRicaviReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContoRicaviHandlerMixin from "@/mixins/handlers/ContoRicaviHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContoRicaviForm from "@/components/gears/forms/OperatnContoRicaviForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContoRicaviForm,
  },
})
export default class ContiRicavi extends Mixins<
  ResourceManagerMixin<ContoRicavi, ContiRicaviCreateBody, ContiRicaviReplaceBody, number> & ContoRicaviHandlerMixin
>(ResourceManagerMixin, ContoRicaviHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo conto ricavi?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i conti ricavi selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<ContoRicavi>[] {
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
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Codice"), this.$validator.unique(this.contiRicaviCodici), this.$validator.length(3)],
        },
      },
      {
        text: "Prg",
        value: "prg",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "number",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Prg"), this.$validator.number()],
        },
      },
      {
        text: "Conto ricavi",
        value: "conto",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Conto ricavi"), this.$validator.unique(this.contiRicaviValues)],
        },
      },
      {
        text: "Descrizione",
        value: "descrizione",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "text",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Descrizione")],
        },
      },
    ];
  }

  get contiRicaviCodici(): string[] {
    return this.getContiRicaviCodici(this.values, this.backupValue);
  }

  get contiRicaviValues(): string[] {
    return this.getContiRicaviValues(this.values, this.backupValue);
  }

  get actions(): Actions<ContoRicavi> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: ContoRicavi): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteContoRicavi(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: ContiRicaviCreateBody): Promise<number> {
    return this.createContoRicavi(value);
  }

  async updateHandler(id: number, value: ContiRicaviReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateContoRicavi(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: ContoRicavi): ContiRicaviReplaceBody {
    return {
      codice: value.codice,
      prg: +value.prg,
      conto: value.conto,
      descrizione: value.descrizione
    };
  }
  tupleValueFromCreateBody(id: number, body: ContiRicaviCreateBody): ContoRicavi {
    return {
      id,
      codice: body.codice,
      prg: +body.prg,
      conto: body.conto,
      descrizione: body.descrizione
    };
  }
  tupleValueFromUpdateBody(id: number, body: ContiRicaviReplaceBody): ContoRicavi {
    return {
      id,
      codice: body.codice,
      prg: +body.prg,
      conto: body.conto,
      descrizione: body.descrizione
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getContiRicavi();
  }
}
</script>