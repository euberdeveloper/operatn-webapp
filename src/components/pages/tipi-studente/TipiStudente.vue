<template>
  <operatn-base-resource-manager
    title="Tipi studente"
    description="Gestione dei tipi studente dell'opera. Attenzione, eliminare un tipo di studente elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi studente"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo tipo studente"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo studente"
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
      <operatn-tipo-studente-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiStudenteValues="tipiStudenteValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-studente-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiStudenteValues="tipiStudenteValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipoStudente, TipiStudenteCreateBody, TipiStudenteReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoStudenteHandlerMixin from "@/mixins/handlers/TipoStudenteHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoStudenteForm from "@/components/gears/forms/OperatnTipoStudenteForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoStudenteForm,
  },
})
export default class TipiStudente extends Mixins<
  ResourceManagerMixin<TipoStudente, TipiStudenteCreateBody, TipiStudenteReplaceBody, number> & TipoStudenteHandlerMixin
>(ResourceManagerMixin, TipoStudenteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo studente?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi studente selezionati?";

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
          rules: [this.$validator.requiredText("Tipo studente"), this.$validator.unique(this.tipiStudenteValues)],
        },
      },
    ];
  }

  get tipiStudenteValues(): string[] {
    return this.getTipiStudenteValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipoStudente> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: TipoStudente): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoStudente(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiStudenteCreateBody): Promise<number> {
    return this.createTipoStudente(value);
  }

  async updateHandler(id: number, value: TipiStudenteReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoStudente(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipoStudente): TipiStudenteReplaceBody {
    return {
      tipoStudente: value.tipoStudente,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiStudenteCreateBody): TipoStudente {
    return {
      id,
      tipoStudente: body.tipoStudente,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiStudenteReplaceBody): TipoStudente {
    return {
      id,
      tipoStudente: body.tipoStudente,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiStudente();
  }
}
</script>