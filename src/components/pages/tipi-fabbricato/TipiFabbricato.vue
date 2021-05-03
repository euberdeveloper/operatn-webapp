<template>
  <operatn-base-resource-manager
    title="Tipi fabbricato"
    description="Gestione dei tipi fabbricato dell'opera. Attenzione, eliminare un tipo di fabbricato elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi fabbricato"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo tipo fabbricato"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo fabbricato"
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
      <operatn-tipo-fabbricato-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiFabbricatoValues="tipiFabbricatoValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-fabbricato-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiFabbricatoValues="tipiFabbricatoValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipoFabbricato, TipiFabbricatoCreateBody, TipiFabbricatoReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoFabbricatoForm from "@/components/gears/forms/OperatnTipoFabbricatoForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoFabbricatoForm,
  },
})
export default class TipiFabbricato extends Mixins<
  ResourceManagerMixin<TipoFabbricato, TipiFabbricatoCreateBody, TipiFabbricatoReplaceBody, number> & TipoFabbricatoHandlerMixin
>(ResourceManagerMixin, TipoFabbricatoHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo fabbricato?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi fabbricato selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<TipoFabbricato>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo fabbricato",
        value: "tipoFabbricato",
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
          rules: [this.$validator.requiredText("Tipo fabbricato"), this.$validator.unique(this.tipiFabbricatoValues)],
        },
      },
    ];
  }

  get tipiFabbricatoValues(): string[] {
    return this.getTipiFabbricatoValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipoFabbricato> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: TipoFabbricato): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoFabbricato(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiFabbricatoCreateBody): Promise<number> {
    return this.createTipoFabbricato(value);
  }

  async updateHandler(id: number, value: TipiFabbricatoReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoFabbricato(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipoFabbricato): TipiFabbricatoReplaceBody {
    return {
      tipoFabbricato: value.tipoFabbricato,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiFabbricatoCreateBody): TipoFabbricato {
    return {
      id,
      tipoFabbricato: body.tipoFabbricato,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiFabbricatoReplaceBody): TipoFabbricato {
    return {
      id,
      tipoFabbricato: body.tipoFabbricato,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiFabbricato();
  }
}
</script>