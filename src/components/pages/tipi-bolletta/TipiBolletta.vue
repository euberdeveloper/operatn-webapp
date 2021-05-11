<template>
  <operatn-base-resource-manager
    title="Tipi bolletta"
    description="Gestione dei tipi bolletta dell'opera. Attenzione, eliminare un tipo di bolletta elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tipi bolletta"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableGroupHeaders="groupHeaders"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableMultiSort
    createDialogTitle="Nuovo tipo bolletta"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tipo bolletta"
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
      <operatn-tipo-bolletta-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :tipiBollettaValues="tipiBollettaValues" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-tipo-bolletta-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :tipiBollettaValues="tipiBollettaValues" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { TipiBollettaReturned, TipiBollettaCreateBody, TipiBollettaReplaceBody, ContoRicavi, Quietanziante } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TipoBollettaHandlerMixin from "@/mixins/handlers/TipoBollettaHandlerMixin";
import ContoRicaviHandlerMixin from "@/mixins/handlers/ContoRicaviHandlerMixin";
import QuietanzianteHandlerMixin from "@/mixins/handlers/QuietanzianteHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTipoBollettaForm from "@/components/gears/forms/OperatnTipoBollettaForm.vue";
import { GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTipoBollettaForm,
  },
})
export default class TipiBolletta extends Mixins<
  ResourceManagerMixin<TipiBollettaReturned, TipiBollettaCreateBody, TipiBollettaReplaceBody, number> &
    TipoBollettaHandlerMixin &
    ContoRicaviHandlerMixin &
    QuietanzianteHandlerMixin
>(ResourceManagerMixin, TipoBollettaHandlerMixin, ContoRicaviHandlerMixin, QuietanzianteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tipo bolletta?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tipi bolletta selezionati?";

  private contiRicavi: ContoRicavi[] = [];
  private quietanzianti: Quietanziante[] = [];

  /* GETTERS AND SETTERS */

  get columns(): Column<TipiBollettaReturned>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo bolletta",
        value: "tipoBolletta",
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
          rules: [this.$validator.requiredText("Tipo bolletta"), this.$validator.unique(this.tipiBollettaValues)],
        },
      },
      {
        text: "Sigla causale",
        value: "siglaCausale",
        groupable: true,

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
          rules: [this.$validator.requiredText("Sigla causale"), this.$validator.length(1)],
        },
      },
      {
        text: "Importo canoni",
        value: "importoCanone",
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
          clearable: true,
          counter: true,
          rules: [this.$validator.price()],
        },
        itemTextHandler: v => v ?? '[NULL]'
      },
      {
        text: "Importo consumi",
        value: "importoConsumi",
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
          clearable: true,
          counter: true,
          rules: [this.$validator.price()],
        },
        itemTextHandler: v => v ?? '[NULL]'
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
          clearable: true,
          items: this.contiRicavi,
          itemText: "codice",
          itemValue: "id",
        },

        itemTextHandler: (idContoRicavi) => {
          if (idContoRicavi) {
            return this.contiRicavi.find((c) => c.id === idContoRicavi)?.codice ?? "NON TROVATO";
          } else {
            return "[NULL]";
          }
        },
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
          clearable: true,
          items: this.contiRicavi,
          itemText: "codice",
          itemValue: "id",
        },

        itemTextHandler: (idContoRicavi) => {
          if (idContoRicavi) {
            return this.contiRicavi.find((c) => c.id === idContoRicavi)?.codice ?? "NON TROVATO";
          } else {
            return "[NULL]";
          }
        },
      },
      {
        text: "Quietanziante",
        value: "idQuietanziante",
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
          clearable: true,
          items: this.quietanzianti,
          itemText: "quietanziante",
          itemValue: "id",
        },

        itemTextHandler: (idQuietanziante) => {
          if (idQuietanziante) {
            return this.quietanzianti.find((c) => c.id === idQuietanziante)?.quietanziante ?? "NON TROVATO";
          } else {
            return "[NULL]";
          }
        },
      },
    ];
  }

  get tipiBollettaValues(): string[] {
    return this.getTipiBollettaValues(this.values, this.backupValue);
  }

  get actions(): Actions<TipiBollettaReturned> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
    };
  }

  get groupHeaders(): GroupHeaders {
    return {
      keyHandler: (key) => (key === "siglaCausale" ? "SIGLA CAUSALE" : key),
    };
  }

  /* METHODS */

  getIdFromValue(value: TipiBollettaReturned): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTipoBolletta(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TipiBollettaCreateBody): Promise<number> {
    return this.createTipoBolletta(value);
  }

  async updateHandler(id: number, value: TipiBollettaReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTipoBolletta(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: TipiBollettaReturned): TipiBollettaReplaceBody {
    return {
      tipoBolletta: value.tipoBolletta,
      siglaCausale: value.siglaCausale,
      importoCanone: value.importoCanone ? +value.importoCanone : null,
      importoConsumi: value.importoConsumi ? +value.importoConsumi : null,
      idContoRicaviConsumi: value.idContoRicaviConsumi,
      idContoRicaviCanoni: value.idContoRicaviCanoni,
      idQuietanziante: value.idQuietanziante,
    };
  }
  tupleValueFromCreateBody(id: number, body: TipiBollettaCreateBody): TipiBollettaReturned {
    return {
      id,
      tipoBolletta: body.tipoBolletta,
      siglaCausale: body.siglaCausale,
      importoCanone: body.importoCanone ? +body.importoCanone : null,
      importoConsumi: body.importoConsumi ? +body.importoConsumi : null,
      idContoRicaviConsumi: body.idContoRicaviConsumi,
      idContoRicaviCanoni: body.idContoRicaviCanoni,
      idQuietanziante: body.idQuietanziante,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TipiBollettaReplaceBody): TipiBollettaReturned {
    return {
      id,
      tipoBolletta: body.tipoBolletta,
      siglaCausale: body.siglaCausale,
      importoCanone: body.importoCanone ? +body.importoCanone : null,
      importoConsumi: body.importoConsumi ? +body.importoConsumi : null,
      idContoRicaviConsumi: body.idContoRicaviConsumi,
      idContoRicaviCanoni: body.idContoRicaviCanoni,
      idQuietanziante: body.idQuietanziante,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTipiBolletta();
    this.contiRicavi = await this.getContiRicavi();
    this.quietanzianti = await this.getQuietanzianti();
  }
}
</script>