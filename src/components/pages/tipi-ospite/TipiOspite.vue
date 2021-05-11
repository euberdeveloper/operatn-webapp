<template>
  <operatn-base-resource-manager
    title="Tipi ospite"
    description="Gestione dei tipi ospite dell'opera. Attenzione, eliminare un tipo di ospite elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi ospite"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableSortBy="sigla"
    tableMultiSort
    createDialogTitle="Nuovo tipo ospite"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo ospite"
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
      <operatn-tipo-ospite-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiOspiteSigle="tipiOspiteSigle"
        :tipiOspiteValues="tipiOspiteValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-ospite-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiOspiteSigle="tipiOspiteSigle"
        :tipiOspiteValues="tipiOspiteValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipiOspiteReturned, TipiOspiteCreateBody, TipiOspiteReplaceBody, ContoRicavi } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";
import ContoRicaviHandlerMixin from "@/mixins/handlers/ContoRicaviHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoOspiteForm from "@/components/gears/forms/OperatnTipoOspiteForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoOspiteForm,
  },
})
export default class TipiOspite extends Mixins<ResourceManagerMixin<TipiOspiteReturned, TipiOspiteCreateBody, TipiOspiteReplaceBody, number> & TipoOspiteHandlerMixin & ContoRicaviHandlerMixin>(
  ResourceManagerMixin,
  TipoOspiteHandlerMixin,
  ContoRicaviHandlerMixin
) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo ospite?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi ospite selezionati?";

  private contiRicavi: ContoRicavi[] = [];

  /* GETTERS AND SETTERS */

  get columns(): Column<TipiOspiteReturned>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
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
          rules: [this.$validator.requiredText("Sigla"), this.$validator.unique(this.tipiOspiteSigle)],
        },
      },
      {
        text: "Tipo ospite",
        value: "tipoOspite",
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
          rules: [this.$validator.requiredText("Tipo ospite"), this.$validator.unique(this.tipiOspiteValues)],
        },
      },
      {
        text: "Conto ricavi canoni",
        value: "idContoRicaviCanoni",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "select",
          label: "Modifica",
          hint: "Premi invio per salvare",
          items: this.contiRicavi,
          itemText: 'codice',
          itemValue: 'id',
          rules: [this.$validator.requiredText("Conto ricavi consumi")],
        },

        itemTextHandler: idContoRicavi => this.contiRicavi.find(c => c.id === idContoRicavi)?.codice ?? 'NON TROVATO'
      },
      {
        text: "Conto ricavi consumi",
        value: "idContoRicaviConsumi",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "select",
          label: "Modifica",
          hint: "Premi invio per salvare",
          items: this.contiRicavi,
          itemText: 'codice',
          itemValue: 'id',
          rules: [this.$validator.requiredText("Conto ricavi consumi")],
        },

        itemTextHandler: idContoRicavi => this.contiRicavi.find(c => c.id === idContoRicavi)?.codice ?? 'NON TROVATO'
      },
    ];
  }

  get tipiOspiteSigle(): string[] {
    return this.getTipiOspiteSigle(this.values, this.backupValue);
  }

  get tipiOspiteValues(): string[] {
    return this.getTipiOspiteValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipiOspiteReturned> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: TipiOspiteReturned): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoOspite(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiOspiteCreateBody): Promise<number> {
    return this.createTipoOspite(value);
  }

  async updateHandler(id: number, value: TipiOspiteReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoOspite(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipiOspiteReturned): TipiOspiteReplaceBody {
    return {
      tipoOspite: value.tipoOspite,
      sigla: value.sigla,
      idContoRicaviConsumi: value.idContoRicaviConsumi,
      idContoRicaviCanoni: value.idContoRicaviCanoni,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiOspiteCreateBody): TipiOspiteReturned {
    return {
      id,
      tipoOspite: body.tipoOspite,
      sigla: body.sigla,
      idContoRicaviConsumi: body.idContoRicaviConsumi,
      idContoRicaviCanoni: body.idContoRicaviCanoni,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiOspiteReplaceBody): TipiOspiteReturned {
    return {
      id,
      tipoOspite: body.tipoOspite,
      sigla: body.sigla,
      idContoRicaviConsumi: body.idContoRicaviConsumi,
      idContoRicaviCanoni: body.idContoRicaviCanoni,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiOspite();
    this.contiRicavi = await this.getContiRicavi();
  }
}
</script>