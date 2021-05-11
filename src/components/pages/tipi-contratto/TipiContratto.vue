<template>
  <operatn-base-resource-manager
    title="Tipi contratto"
    description="Gestione dei tipi contratto dell'opera. Attenzione, eliminare un tipo di contratto elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi contratto"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableGroupHeaders="groupHeaders"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableSortBy="sigla"
    tableMultiSort
    createDialogTitle="Nuovo tipo contratto"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo contratto"
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
      <operatn-tipo-contratto-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiContrattoSigle="tipiContrattoSigle"
        :tipiContrattoValues="tipiContrattoValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-contratto-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiContrattoSigle="tipiContrattoSigle"
        :tipiContrattoValues="tipiContrattoValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipiContrattoReturned, TipiContrattoCreateBody, TipiContrattoReplaceBody, TipoStudente } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoContrattoHandlerMixin from "@/mixins/handlers/TipoContrattoHandlerMixin";
import TipoStudenteHandlerMixin from "@/mixins/handlers/TipoStudenteHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoContrattoForm from "@/components/gears/forms/OperatnTipoContrattoForm.vue";
import { GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoContrattoForm,
  },
})
export default class TipiContratto extends Mixins<ResourceManagerMixin<TipiContrattoReturned, TipiContrattoCreateBody, TipiContrattoReplaceBody, number> & TipoContrattoHandlerMixin & TipoStudenteHandlerMixin>(
  ResourceManagerMixin,
  TipoContrattoHandlerMixin,
  TipoStudenteHandlerMixin
) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo contratto?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi contratto selezionati?";

  private tipoStudente: TipoStudente[] = [];

  /* GETTERS AND SETTERS */

  get columns(): Column<TipiContrattoReturned>[] {
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
          rules: [this.$validator.requiredText("Sigla"), this.$validator.unique(this.tipiContrattoSigle)],
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
          rules: [this.$validator.requiredText("Nome"), this.$validator.unique(this.tipiContrattoValues)],
        },
      },
      {
        text: "Tipo studente",
        value: "idTipoStudente",
        groupable: true,

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
          items: this.tipoStudente,
          itemText: 'tipoStudente',
          itemValue: 'id',
          rules: [this.$validator.requiredText("Tipo studente")],
        },

        itemTextHandler: idTipoStudente => this.tipoStudente.find(c => c.id === idTipoStudente)?.tipoStudente ?? 'NON TROVATO'
      }
    ];
  }

  get tipiContrattoSigle(): string[] {
    return this.getTipiContrattoSigle(this.values, this.backupValue);
  }

  get tipiContrattoValues(): string[] {
    return this.getTipiContrattoValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipiContrattoReturned> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
    };
  }

  get groupHeaders(): GroupHeaders {
    return {
      keyHandler: () => 'TIPO STUDENTE',
      valueHandler: id => this.tipoStudente.find(t => t.id === +id)?.tipoStudente ?? 'NON TROVATO'
    };
  }

  /* METHODS */

  getIdFromValue(value: TipiContrattoReturned): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoContratto(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiContrattoCreateBody): Promise<number> {
    return this.createTipoContratto(value);
  }

  async updateHandler(id: number, value: TipiContrattoReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoContratto(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipiContrattoReturned): TipiContrattoReplaceBody {
    return {
      nome: value.nome,
      sigla: value.sigla,
      idTipoStudente: value.idTipoStudente
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiContrattoCreateBody): TipiContrattoReturned {
    return {
      id,
      nome: body.nome,
      sigla: body.sigla,
      idTipoStudente: body.idTipoStudente
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiContrattoReplaceBody): TipiContrattoReturned {
    return {
      id,
      nome: body.nome,
      sigla: body.sigla,
      idTipoStudente: body.idTipoStudente,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiContratto();
    this.tipoStudente = await this.getTipiStudente();
  }
}
</script>