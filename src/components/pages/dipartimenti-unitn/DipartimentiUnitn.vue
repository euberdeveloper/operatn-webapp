<template>
  <operatn-base-resource-manager
    title="Dipartimenti unitn"
    description="Gestione dei dipartimenti unitn dell'opera."
    tableTitle="Dipartimenti unitn"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="codice"
    tableMultiSort
    tableShowSelect
    :tableUpdateBody.sync="updateBody"
    tableSortBy="codice"
    dialogWidth="80vw"
    dialogWidthMobile="90vw"
    createDialogTitle="Nuovo dipartimento unitn"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica dipartimento unitn"
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
      <operatn-dipartimento-unitn-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :dipartimentiUnitnCodici="dipartimentiUnitnCodici"
        :dipartimentiUnitnSigle="dipartimentiUnitnSigle"
        :dipartimentiUnitnNomi="dipartimentiUnitnNomi"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-dipartimento-unitn-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :dipartimentiUnitnCodici="dipartimentiUnitnCodici"
        :dipartimentiUnitnSigle="dipartimentiUnitnSigle"
        :dipartimentiUnitnNomi="dipartimentiUnitnNomi"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { DipartimentoUnitn, DipartimentiUnitnCreateBody, DipartimentiUnitnUpdateBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import DipartimentoUnitnHandlerMixin from "@/mixins/handlers/DipartimentoUnitnHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnDipartimentoUnitnForm from "@/components/gears/forms/OperatnDipartimentoUnitnForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnDipartimentoUnitnForm,
  },
})
export default class DipartimentiUnin extends Mixins<
  ResourceManagerMixin<DipartimentoUnitn, DipartimentiUnitnCreateBody, DipartimentiUnitnUpdateBody, string> & DipartimentoUnitnHandlerMixin
>(ResourceManagerMixin, DipartimentoUnitnHandlerMixin) {
  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo dipartimento unitn?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i dipartimenti unitn selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<DipartimentoUnitn>[] {
    return [
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
          rules: [this.$validator.requiredText("codice"), this.$validator.unique(this.dipartimentiUnitnCodici), this.$validator.length(4)],
        },
      },
      {
        text: "Sigla",
        value: "sigla",
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
          rules: [this.$validator.requiredText("sigla"), this.$validator.unique(this.dipartimentiUnitnSigle)],
        },
      },
      {
        text: "Nome",
        value: "nome",
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
          rules: [this.$validator.requiredText("nome"), this.$validator.unique(this.dipartimentiUnitnNomi)],
        },
      },
      {
        text: "Provincia",
        value: "provincia",
        groupable: false,
        editable: false,
      },
      {
        text: "Comune",
        value: "comune",
        groupable: false,
        editable: false,
      },
    ];
  }

  get dipartimentiUnitnCodici(): string[] {
    return this.getDipartimentiUnitnCodici(this.values, this.backupValue);
  }

  get dipartimentiUnitnSigle(): string[] {
    return this.getDipartimentiUnitnSigle(this.values, this.backupValue);
  }

  get dipartimentiUnitnNomi(): string[] {
    return this.getDipartimentiUnitnNomi(this.values, this.backupValue);
  }

  get actions(): Actions<DipartimentoUnitn> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: (item) => this.askDelete(item),
    };
  }

  /* METHODS */

  getIdFromValue(value: DipartimentoUnitn): string {
    return value.codice;
  }

  async deleteHandler(codice: string, isMultiple: boolean): Promise<void> {
    await this.deleteDipartimentoUnitn(codice, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: DipartimentiUnitnCreateBody): Promise<string> {
    return this.createDipartimentoUnitn(value);
  }

  async updateHandler(codice: string, value: DipartimentiUnitnUpdateBody, isTableEdit: boolean): Promise<void> {
    await this.updateDipartimentoUnitn(codice, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: DipartimentoUnitn): DipartimentiUnitnUpdateBody {
    return {
      codice: value.codice,
      sigla: value.sigla,
      nome: value.nome,
      provincia: value.provincia,
      comune: value.comune,
      cap: value.cap,
      indirizzo: value.indirizzo,
      nCivico: value.nCivico,
      sitoWeb: value.sitoWeb,
    };
  }
  tupleValueFromCreateBody(codice: string, body: DipartimentiUnitnCreateBody): DipartimentoUnitn {
    return {
      codice: body.codice ?? codice,
      sigla: body.sigla,
      nome: body.nome,
      provincia: body.provincia,
      comune: body.comune,
      cap: body.cap,
      indirizzo: body.indirizzo,
      nCivico: body.nCivico,
      sitoWeb: body.sitoWeb,
      dataCreazione: body.dataCreazione,
      eliminato: body.eliminato,
    };
  }
  tupleValueFromUpdateBody(codice: string, body: DipartimentiUnitnUpdateBody, backupValue: DipartimentoUnitn): DipartimentoUnitn {
    return {
      codice: body.codice ?? codice,
      sigla: body.sigla as string,
      nome: body.nome as string,
      provincia: body.provincia as string,
      comune: body.comune as string,
      cap: body.cap as string,
      indirizzo: body.indirizzo as string,
      nCivico: body.nCivico as string,
      sitoWeb: body.sitoWeb as string,
      dataCreazione: backupValue.dataCreazione,
      eliminato: backupValue.eliminato,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getDipartimentiUnitn();
  }
}
</script>