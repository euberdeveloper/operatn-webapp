<template>
  <operatn-base-resource-manager
    title="Tariffe"
    description="Gestione dei tariffe dell'opera. Attenzione, eliminare un tariffa elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Tariffe"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    :tableGroupHeaders="groupHeaders"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableMultiSort
    createDialogTitle="Nuovo tariffa"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica tariffa"
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
      <operatn-tariffa-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-tariffa-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Tariffa, TariffeCreateBody, TariffeReplaceBody, TipiOspiteReturned, TipoFabbricato, TipoStanza, TipoTariffa } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import TariffaHandlerMixin from "@/mixins/handlers/TariffaHandlerMixin";
import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";
import TipoOspiteHandlerMixin from "@/mixins/handlers/TipoOspiteHandlerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";
import TipoTariffaHandlerMixin from "@/mixins/handlers/TipoTariffaHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions, GroupHeaders } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnTariffaForm from "@/components/gears/forms/OperatnTariffaForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnTariffaForm,
  },
})
export default class Tariffe extends Mixins<
  ResourceManagerMixin<Tariffa, TariffeCreateBody, TariffeReplaceBody, number> &
    TariffaHandlerMixin &
    TipoFabbricatoHandlerMixin &
    TipoOspiteHandlerMixin &
    TipoTariffaHandlerMixin &
    TipoStanzaHandlerMixin
>(ResourceManagerMixin, TariffaHandlerMixin, TipoFabbricatoHandlerMixin, TipoOspiteHandlerMixin, TipoTariffaHandlerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo tariffa?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i tariffe selezionati?";

  private tipiFabbricato: TipoFabbricato[] = [];
  private tipiStanza: TipoStanza[] = [];
  private tipiOspite: TipiOspiteReturned[] = [];
  private tipiTariffa: TipoTariffa[] = [];

  /* GETTERS AND SETTERS */

  get columns(): Column<Tariffa>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Tipo ospite",
        value: "idTipoOspite",
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
          items: this.tipiOspite,
          itemText: "tipoOspite",
          itemValue: "id",
          rules: [this.$validator.requiredText("Tipo ospite")],
        },

        itemTextHandler: (id) => this.tipiOspite.find((v) => v.id === id)?.tipoOspite ?? "[NULL]",
      },
      {
        text: "Tipo tariffa",
        value: "idTipoTariffa",
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
          items: this.tipiTariffa,
          itemText: "tipoTariffa",
          itemValue: "id",
          rules: [this.$validator.requiredText("Tipo tariffa")],
        },

        itemTextHandler: (id) => this.tipiTariffa.find((v) => v.id === id)?.tipoTariffa ?? "[NULL]",
      },
      {
        text: "Utilizzo stanza",
        value: "idUtilizzoStanza",
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
          items: this.tipiStanza,
          itemText: "tipoStanza",
          itemValue: "id",
          clearable: true,
        },

        itemTextHandler: (id) => this.tipiStanza.find((v) => v.id === id)?.tipoStanza ?? "[NULL]",
      },
      {
        text: "Tipo fabbricato",
        value: "idTipoFabbricato",
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
          items: this.tipiFabbricato,
          itemText: "tipoFabbricato",
          itemValue: "id",
          clearable: true,
        },

        itemTextHandler: (id) => this.tipiFabbricato.find((v) => v.id === id)?.tipoFabbricato ?? "[NULL]",
      },
      {
        text: "Prezzo canoni",
        value: "prezzoCanoni",
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
          rules: [this.$validator.requiredText("Prezzo canoni"), this.$validator.price()],
        },
        itemTextHandler: (v) => v ?? "[NULL]",
      },
      {
        text: "Prezzo consumi",
        value: "prezzoConsumi",
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
          rules: [this.$validator.requiredText("Prezzo consumi"), this.$validator.price()],
        },
        itemTextHandler: (v) => v ?? "[NULL]",
      },
    ];
  }

  get actions(): Actions<Tariffa> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
    };
  }

  get groupHeaders(): GroupHeaders {
    return {
      keyHandler: (key) => {
        switch (key) {
          case "idTipoOspite":
            return "TIPO OSPITE";
          case "idTipoTariffa":
            return "TIPO TARIFFA";
          case "idUtilizzoStanza":
            return "UTILIZZO STANZA";
          case "idTipoFabbricato":
            return "TIPO FABBRICATO";
          default:
            return key;
        }
      },
      valueHandler: (value, key) => {
        switch (key) {
          case "idTipoOspite":
            return this.tipiOspite.find((v) => v.id === +value)?.tipoOspite ?? "[NULL]"
          case "idTipoTariffa":
            return this.tipiTariffa.find((v) => v.id === +value)?.tipoTariffa ?? "[NULL]"
          case "idUtilizzoStanza":
            return this.tipiStanza.find((v) => v.id === +value)?.tipoStanza ?? "[NULL]"
          case "idTipoFabbricato":
            return this.tipiFabbricato.find((v) => v.id === +value)?.tipoFabbricato ?? "[NULL]"
          default:
            return key;
        }
      },
    };
  }

  /* METHODS */

  getIdFromValue(value: Tariffa): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteTariffa(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: TariffeCreateBody): Promise<number> {
    return this.createTariffa(value);
  }

  async updateHandler(id: number, value: TariffeReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateTariffa(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: Tariffa): TariffeReplaceBody {
    return {
      idTipoOspite: value.idTipoOspite,
      idUtilizzoStanza: value.idUtilizzoStanza,
      idTipoFabbricato: value.idTipoFabbricato,
      idTipoTariffa: value.idTipoTariffa,
      prezzoConsumi: value.prezzoConsumi,
      prezzoCanoni: value.prezzoCanoni,
    };
  }
  tupleValueFromCreateBody(id: number, body: TariffeCreateBody): Tariffa {
    return {
      id,
      idTipoOspite: body.idTipoOspite,
      idUtilizzoStanza: body.idUtilizzoStanza,
      idTipoFabbricato: body.idTipoFabbricato,
      idTipoTariffa: body.idTipoTariffa,
      prezzoConsumi: body.prezzoConsumi,
      prezzoCanoni: body.prezzoCanoni,
      dataCreazione: this.backupValue?.dataCreazione || new Date(),
      eliminato: null,
    };
  }
  tupleValueFromUpdateBody(id: number, body: TariffeReplaceBody): Tariffa {
    return {
      id,
      idTipoOspite: body.idTipoOspite,
      idUtilizzoStanza: body.idUtilizzoStanza,
      idTipoFabbricato: body.idTipoFabbricato,
      idTipoTariffa: body.idTipoTariffa,
      prezzoConsumi: body.prezzoConsumi,
      prezzoCanoni: body.prezzoCanoni,
      dataCreazione: this.backupValue?.dataCreazione || new Date(),
      eliminato: null,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getTariffe();
    this.tipiFabbricato = await this.getTipiFabbricato();
    this.tipiStanza = await this.getTipiStanza();
    this.tipiTariffa = await this.getTipiTariffa();
    this.tipiOspite = await this.getTipiOspite();
  }
}
</script>