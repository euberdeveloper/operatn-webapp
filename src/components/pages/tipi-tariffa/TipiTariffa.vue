<template>
  <operatn-base-resource-manager
    title="Tipi tariffa"
    description="Gestione dei tipi tariffa dell'opera. Attenzione, eliminare un tipo di tariffa elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi tariffa"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo tipo tariffa"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo tariffa"
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
      <operatn-tipo-tariffa-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiTariffaValues="tipiTariffaValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-tariffa-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiTariffaValues="tipiTariffaValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipoTariffa, TipiTariffaCreateBody, TipiTariffaReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoTariffaHandlerMixin from "@/mixins/handlers/TipoTariffaHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoTariffaForm from "@/components/gears/forms/OperatnTipoTariffaForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoTariffaForm,
  },
})
export default class TipiTariffa extends Mixins<
  ResourceManagerMixin<TipoTariffa, TipiTariffaCreateBody, TipiTariffaReplaceBody, number> & TipoTariffaHandlerMixin
>(ResourceManagerMixin, TipoTariffaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo tariffa?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi tariffa selezionati?";

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
          rules: [this.$validator.requiredText("Tipo tariffa"), this.$validator.unique(this.tipiTariffaValues)],
        },
      },
    ];
  }

  get tipiTariffaValues(): string[] {
    return this.getTipiTariffaValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipoTariffa> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: TipoTariffa): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoTariffa(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiTariffaCreateBody): Promise<number> {
    return this.createTipoTariffa(value);
  }

  async updateHandler(id: number, value: TipiTariffaReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoTariffa(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipoTariffa): TipiTariffaReplaceBody {
    return {
      tipoTariffa: value.tipoTariffa,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiTariffaCreateBody): TipoTariffa {
    return {
      id,
      tipoTariffa: body.tipoTariffa,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiTariffaReplaceBody): TipoTariffa {
    return {
      id,
      tipoTariffa: body.tipoTariffa,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiTariffa();
  }
}
</script>