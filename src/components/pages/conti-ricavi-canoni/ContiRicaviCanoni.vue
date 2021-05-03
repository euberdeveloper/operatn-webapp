<template>
  <operatn-base-resource-manager
    title="COnti ricavi canoni"
    description="Gestione dei conti ricavi canoni dell'opera. Attenzione, eliminare un conto ricavi canoni elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="COnti ricavi canoni"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo conto ricavi canoni"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica conto ricavi canoni"
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
      <operatn-conto-ricavi-canoni-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :contiRicaviCanoniValues="contiRicaviCanoniValues"
        :contiRicaviCanoniCodici="contiRicaviCanoniCodici"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-conto-ricavi-canoni-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :contiRicaviCanoniValues="contiRicaviCanoniValues"
        :contiRicaviCanoniCodici="contiRicaviCanoniCodici"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { ContoRicaviCanoni, ContiRicaviCanoniCreateBody, ContiRicaviCanoniReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContoRicaviCanoniHandlerMixin from "@/mixins/handlers/ContoRicaviCanoniHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContoRicaviCanoniForm from "@/components/gears/forms/OperatnContoRicaviCanoniForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContoRicaviCanoniForm,
  },
})
export default class ContiRicaviCanoni extends Mixins<
  ResourceManagerMixin<ContoRicaviCanoni, ContiRicaviCanoniCreateBody, ContiRicaviCanoniReplaceBody, number> & ContoRicaviCanoniHandlerMixin
>(ResourceManagerMixin, ContoRicaviCanoniHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo conto ricavi canoni?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i conti ricavi canoni selezionati?";

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
          rules: [this.$validator.requiredText("Codice"), this.$validator.unique(this.contiRicaviCanoniCodici)],
        },
      },
      {
        text: "Conto ricavi canoni",
        value: "contoRicaviCanoni",
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
          rules: [this.$validator.requiredText("Conto ricavi canoni"), this.$validator.unique(this.contiRicaviCanoniValues)],
        },
      },
    ];
  }

  get contiRicaviCanoniCodici(): string[] {
    return this.getContiRicaviCanoniCodici(this.values, this.backupValue);
  }

  get contiRicaviCanoniValues(): string[] {
    return this.getContiRicaviCanoniValues(this.values, this.backupValue);
  }

  get actions(): Actions<ContoRicaviCanoni> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: ContoRicaviCanoni): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteContoRicaviCanoni(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: ContiRicaviCanoniCreateBody): Promise<number> {
    return this.createContoRicaviCanoni(value);
  }

  async updateHandler(id: number, value: ContiRicaviCanoniReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateContoRicaviCanoni(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: ContoRicaviCanoni): ContiRicaviCanoniReplaceBody {
    return {
      codice: value.codice,
      contoRicaviCanoni: value.contoRicaviCanoni,
    };
  }
  tupleValueFromCreateBody(id: number, body: ContiRicaviCanoniCreateBody): ContoRicaviCanoni {
    return {
      id,
      codice: body.codice,
      contoRicaviCanoni: body.contoRicaviCanoni,
    };
  }
  tupleValueFromUpdateBody(id: number, body: ContiRicaviCanoniReplaceBody): ContoRicaviCanoni {
    return {
      id,
      codice: body.codice,
      contoRicaviCanoni: body.contoRicaviCanoni,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getContiRicaviCanoni();
  }
}
</script>