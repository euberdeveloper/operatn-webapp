<template>
  <operatn-base-resource-manager
    title="COnti ricavi consumi"
    description="Gestione dei conti ricavi consumi dell'opera. Attenzione, eliminare un conto ricavi consumi elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="COnti ricavi consumi"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo conto ricavi consumi"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica conto ricavi consumi"
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
      <operatn-conto-ricavi-consumi-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :contiRicaviConsumiValues="contiRicaviConsumiValues"
        :contiRicaviConsumiCodici="contiRicaviConsumiCodici"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-conto-ricavi-consumi-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :contiRicaviConsumiValues="contiRicaviConsumiValues"
        :contiRicaviConsumiCodici="contiRicaviConsumiCodici"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { ContoRicaviConsumi, ContiRicaviConsumiCreateBody, ContiRicaviConsumiReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContoRicaviConsumiHandlerMixin from "@/mixins/handlers/ContoRicaviConsumiHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContoRicaviConsumiForm from "@/components/gears/forms/OperatnContoRicaviConsumiForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContoRicaviConsumiForm,
  },
})
export default class ContiRicaviConsumi extends Mixins<
  ResourceManagerMixin<ContoRicaviConsumi, ContiRicaviConsumiCreateBody, ContiRicaviConsumiReplaceBody, number> & ContoRicaviConsumiHandlerMixin
>(ResourceManagerMixin, ContoRicaviConsumiHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo conto ricavi consumi?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i conti ricavi consumi selezionati?";

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
          rules: [this.$validator.requiredText("Codice"), this.$validator.unique(this.contiRicaviConsumiCodici)],
        },
      },
      {
        text: "Conto ricavi consumi",
        value: "contoRicaviConsumi",
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
          rules: [this.$validator.requiredText("Conto ricavi consumi"), this.$validator.unique(this.contiRicaviConsumiValues)],
        },
      },
    ];
  }

  get contiRicaviConsumiCodici(): string[] {
    return this.getContiRicaviConsumiCodici(this.values, this.backupValue);
  }

  get contiRicaviConsumiValues(): string[] {
    return this.getContiRicaviConsumiValues(this.values, this.backupValue);
  }

  get actions(): Actions<ContoRicaviConsumi> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: ContoRicaviConsumi): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteContoRicaviConsumi(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: ContiRicaviConsumiCreateBody): Promise<number> {
    return this.createContoRicaviConsumi(value);
  }

  async updateHandler(id: number, value: ContiRicaviConsumiReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateContoRicaviConsumi(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: ContoRicaviConsumi): ContiRicaviConsumiReplaceBody {
    return {
      codice: value.codice,
      contoRicaviConsumi: value.contoRicaviConsumi,
    };
  }
  tupleValueFromCreateBody(id: number, body: ContiRicaviConsumiCreateBody): ContoRicaviConsumi {
    return {
      id,
      codice: body.codice,
      contoRicaviConsumi: body.contoRicaviConsumi,
    };
  }
  tupleValueFromUpdateBody(id: number, body: ContiRicaviConsumiReplaceBody): ContoRicaviConsumi {
    return {
      id,
      codice: body.codice,
      contoRicaviConsumi: body.contoRicaviConsumi,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getContiRicaviConsumi();
  }
}
</script>