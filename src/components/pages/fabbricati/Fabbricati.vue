<template>
  <operatn-base-resource-manager
    title="Fabbricati"
    description="Gestione dei fabbricati dell'opera. Attenzione, eliminare un fabbricato elimina a cascata tutte le stanze associates."
    tableTitle="Fabbricati"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableMultiSort
    tableSortBy="codice"
    :tableGroupHeaders="groupHeaders"
    createDialogTitle="Nuovo fabbricato"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica fabbricato"
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
      <operatn-fabbricato-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :fabbricatiNomi="fabbricatiNomi"
        :fabbricatiCodici="fabbricatiCodici"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-fabbricato-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :fabbricatiNomi="fabbricatiNomi"
        :fabbricatiCodici="fabbricatiCodici"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Fabbricato, FabbricatiCreateBody, FabbricatiReplaceBody, TipoFabbricato } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import FabbricatoHandlerMixin from "@/mixins/handlers/FabbricatoHandlerMixin";
import TipoFabbricatoHandlerMixin from "@/mixins/handlers/TipoFabbricatoHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnFabbricatoForm from "@/components/gears/forms/OperatnFabbricatoForm.vue";
import { GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnFabbricatoForm,
  },
})
export default class Fabbricati extends Mixins<
  ResourceManagerMixin<Fabbricato, FabbricatiCreateBody, FabbricatiReplaceBody, number> & FabbricatoHandlerMixin & TipoFabbricatoHandlerMixin
>(ResourceManagerMixin, FabbricatoHandlerMixin, TipoFabbricatoHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo fabbricato?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i fabbricati selezionati?";

  private tipiFabbricato: TipoFabbricato[] = [];

  /* GETTERS AND SETTERS */

  get columns(): Column<Fabbricato>[] {
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
          clearable: true,
          counter: true,
          rules: [this.$validator.requiredText("Codice"), this.$validator.unique(this.fabbricatiCodici)],
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
          clearable: true,
          counter: true,
          rules: [this.$validator.requiredText("Nome"), this.$validator.unique(this.fabbricatiNomi)],
        },
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
          rules: [this.$validator.requiredText("Tipo fabbricato")],
        },

        itemTextHandler: (id) => this.tipiFabbricato.find((v) => v.id === id)?.tipoFabbricato ?? "NON TROVATO",
      },
      {
        text: "Provincia",
        value: "provincia",
        groupable: false,
      },
      {
        text: "Comune",
        value: "comune",
        groupable: true,
      },
    ];
  }

  get actions(): Actions<Fabbricato> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
      onView: (item) => { this.$router.push(`fabbricati/${item.id}`) }
    };
  }

  get groupHeaders(): GroupHeaders {
    return {
      keyHandler: (key) => (key === "idTipoFabbricato" ? "TIPO FABBRICATO" : key),
      valueHandler: (value, key) => (key === "idTipoFabbricato" ? this.tipiFabbricato.find((v) => v.id === +value)?.tipoFabbricato ?? "NON TROVATO" : value),
    };
  }

  get fabbricatiCodici(): string[] {
    return this.getFabbricatiCodici(this.values, this.backupValue);
  }

  get fabbricatiNomi(): string[] {
    return this.getFabbricatiNomi(this.values, this.backupValue);
  }

  /* METHODS */

  getIdFromValue(value: Fabbricato): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteFabbricato(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: FabbricatiCreateBody): Promise<number> {
    return this.createFabbricato(value);
  }

  async updateHandler(id: number, value: FabbricatiReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateFabbricato(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: Fabbricato): FabbricatiReplaceBody {
    return {
      codice: value.codice,
      nome: value.nome,
      idTipoFabbricato: value.idTipoFabbricato,
      provincia: value.provincia,
      comune: value.comune,
      cap: value.cap,
      indirizzo: value.indirizzo,
      nCivico: value.nCivico,
    };
  }
  tupleValueFromCreateBody(id: number, body: FabbricatiCreateBody): Fabbricato {
    return {
      id,
      codice: body.codice,
      nome: body.nome,
      idTipoFabbricato: body.idTipoFabbricato,
      provincia: body.provincia,
      comune: body.comune,
      cap: body.cap,
      indirizzo: body.indirizzo,
      nCivico: body.nCivico,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }
  tupleValueFromUpdateBody(id: number, body: FabbricatiReplaceBody): Fabbricato {
    return {
      id,
      codice: body.codice,
      nome: body.nome,
      idTipoFabbricato: body.idTipoFabbricato,
      provincia: body.provincia,
      comune: body.comune,
      cap: body.cap,
      indirizzo: body.indirizzo,
      nCivico: body.nCivico,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getFabbricati();
    this.tipiFabbricato = await this.getTipiFabbricato();
  }
}
</script>