<template>
  <operatn-base-resource-manager
    title="Tipi stanza"
    description="Gestione dei tipi stanza dell'opera. Attenzione, eliminare un tipo di stanza elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi stanza"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo tipo stanza"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo stanza"
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
      <operatn-tipo-stanza-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :tipiStanzaValues="tipiStanzaValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-stanza-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :tipiStanzaValues="tipiStanzaValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipoStanza, TipiStanzaCreateBody, TipiStanzaReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoStanzaForm from "@/components/gears/forms/OperatnTipoStanzaForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoStanzaForm,
  },
})
export default class TipiStanza extends Mixins<
  ResourceManagerMixin<TipoStanza, TipiStanzaCreateBody, TipiStanzaReplaceBody, number> & TipoStanzaHandlerMixin
>(ResourceManagerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo stanza?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi stanza selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<TipoStanza>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo stanza",
        value: "tipoStanza",
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
          rules: [this.$validator.requiredText("Tipo stanza"), this.$validator.unique(this.tipiStanzaValues)],
        },
      },
    ];
  }

  get tipiStanzaValues(): string[] {
    return this.getTipiStanzaValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipoStanza> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: TipoStanza): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoStanza(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiStanzaCreateBody): Promise<number> {
    return this.createTipoStanza(value);
  }

  async updateHandler(id: number, value: TipiStanzaReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoStanza(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipoStanza): TipiStanzaReplaceBody {
    return {
      tipoStanza: value.tipoStanza,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiStanzaCreateBody): TipoStanza {
    return {
      id,
      tipoStanza: body.tipoStanza,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiStanzaReplaceBody): TipoStanza {
    return {
      id,
      tipoStanza: body.tipoStanza,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiStanza();
  }
}
</script>