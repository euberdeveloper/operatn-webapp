<template>
  <operatn-base-resource-manager
    title="Contratti provvisori"
    description="Gestione dei contratti dell'opera"
    :isCard="false"
    tableTitle="Contratti"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    tableShowSelect
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo contratto"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica contratto"
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
      <operatn-contratto-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-contratto-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Contratto, ContrattiCreateBody, ContrattiReplaceBody, ContrattiReturned } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContrattoHandlerMixin from "@/mixins/handlers/ContrattoHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContrattoForm from "@/components/gears/forms/contratto/OperatnContrattoForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContrattoForm,
  },
})
export default class Contratti extends Mixins<ResourceManagerMixin<ContrattiReturned, ContrattiCreateBody, ContrattiReplaceBody, number> & ContrattoHandlerMixin>(
  ResourceManagerMixin,
  ContrattoHandlerMixin
) {
  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo contratto?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i contratti selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<Contratto>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      //   {
      //     text: "Contratto",
      //     value: "contratto",
      //     groupable: false,

      //     editable: true,
      //     onEditCancel: () => this.sprepareUpdateBody(),
      //     onEditClose: () => {},
      //     onEditSave: () => this.updateValue(),
      //     onEditOpen: (item) => {
      //       this.prepareUpdateBody(item);
      //     },
      //     editInput: {
      //       type: "text",
      //       label: "Modifica",
      //       hint: "Premi invio per salvare",
      //       counter: true,
      //       rules: [this.$validator.requiredText("Contratto"), this.$validator.unique(this.contrattiValues)],
      //     },
      //   },
      //   {
      //     text: "Denominazione",
      //     value: "denominazione",
      //     groupable: false,
      //     editable: false,
      //     itemTextHandler: value => value ?? '[NULL]'
      //   },
    ];
  }

  get actions(): Actions<Contratto> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: (item) => this.askDelete(item),
    };
  }

  /* METHODS */

  getIdFromValue(value: Contratto): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteContratto(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: ContrattiCreateBody): Promise<number> {
    return this.createContratto(value);
  }

  async updateHandler(id: number, value: ContrattiReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateContratto(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: ContrattiReturned): ContrattiReplaceBody {
    return {
      dataInizio: value.dataInizio,
      dataFine: value.dataFine,
      checkout: value.checkout,
      cauzione: value.cauzione,
      tipoRata: value.tipoRata,
      idTariffa: value.idTariffa,
      idTipoContratto: value.idTipoContratto,
      idQuietanziante: value.idQuietanziante,
      ospiti: value.contrattiSuOspite
        ? value.contrattiSuOspite.map((cso) => ({
            idOspite: cso.idOspite,
            postiLetto: cso.contrattiSuOspiteSuPostoLetto ? cso.contrattiSuOspiteSuPostoLetto.map((pl) => pl.idPostoLetto) : [],
          }))
        : [],
      note: value.note,
    };
  }
  tupleValueFromCreateBody(id: number, body: ContrattiCreateBody): ContrattiReturned {
    return {
      dataInizio: body.dataInizio,
      dataFine: body.dataFine,
      checkout: body.checkout,
      cauzione: body.cauzione,
      tipoRata: body.tipoRata,
      idTariffa: body.idTariffa,
      idTipoContratto: body.idTipoContratto,
      idQuietanziante: body.idQuietanziante,
      contrattiSuOspite: [],
      note: body.note,
    } as any;
  }
  tupleValueFromUpdateBody(id: number, body: ContrattiReplaceBody): ContrattiReturned {
    return {
      id,
       dataInizio: body.dataInizio,
      dataFine: body.dataFine,
      checkout: body.checkout,
      cauzione: body.cauzione,
      tipoRata: body.tipoRata,
      idTariffa: body.idTariffa,
      idTipoContratto: body.idTipoContratto,
      idQuietanziante: body.idQuietanziante,
      contrattiSuOspite: [],
      note: body.note,
    } as any;
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getContrattiDaFirmare({
      contrattiSuOspite: {
        ospite: { persona: true },
        contrattiSuOspiteSuPostoLetto: {
          postoLetto: true
        }
      }
    });
  }
}
</script>