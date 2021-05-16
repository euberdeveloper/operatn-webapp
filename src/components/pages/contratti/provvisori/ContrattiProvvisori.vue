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
    :tableLoading="tableLoading"
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
    <template v-slot:tableHeader>
      <span class="mx-4" />
      <operatn-date-input placeholder="Data inizio" style="flex: 1" name="dataInizio" dense hideDetails clearable v-model="dateQueryParams.dataInizio" />
      <span class="mx-4" />
      <operatn-date-input placeholder="Data fine" style="flex: 1" name="dataFine" dense hideDetails clearable v-model="dateQueryParams.dataFine" />
      <span class="mx-4" />
    </template>
    <template v-slot:createDialog>
      <operatn-contratto-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-contratto-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiFilterParams, ContrattiReplaceBody, ContrattiReturned } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContrattoHandlerMixin from "@/mixins/handlers/ContrattoHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContrattoForm from "@/components/gears/forms/contratto/OperatnContrattoForm.vue";
import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";

interface Tuple {
  id: number;
  dataInizio: Date;
  dataFine: Date;
  nome: string;
  cognome: string;
  codiceFabbricato: string;
  unitaImmobiliare: string;
  numeroStanza: string;
  postiLetto: string;
  dataInserimento: Date;
  reference: ContrattiReturned;
}

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContrattoForm,
    OperatnDateInput,
  },
})
export default class Contratti extends Mixins<ResourceManagerMixin<Tuple, ContrattiCreateBody, ContrattiReplaceBody, number> & ContrattoHandlerMixin>(
  ResourceManagerMixin,
  ContrattoHandlerMixin
) {
  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo contratto?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i contratti selezionati?";

  private contratti: ContrattiReturned[] = [];
  private dateQueryParams: ContrattiFilterParams = {
    dataInizio: undefined,
    dataFine: undefined,
  };
  private tableLoading = false;

  /* GETTERS AND SETTERS */

  get columns(): Column<Tuple>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Data inizio",
        value: "dataInizio",
        groupable: false,

        editable: false,
        itemTextHandler: (value) => value.toLocaleDateString(),
      },
      {
        text: "Data fine",
        value: "dataFine",
        groupable: false,

        editable: false,
        itemTextHandler: (value) => value.toLocaleDateString(),
      },
      {
        text: "Nome",
        value: "nome",
        groupable: false,
        editable: false,
      },
      {
        text: "Cognome",
        value: "cognome",
        groupable: false,
        editable: false,
      },
      {
        text: "Fabbricato",
        value: "codiceFabbricato",
        groupable: false,
        editable: false,
      },
      {
        text: "Unità immobiliare",
        value: "unitaImmobiliare",
        groupable: false,
        editable: false,
      },
      {
        text: "Numero stanza",
        value: "numeroStanza",
        groupable: false,
        editable: false,
      },
      {
        text: "Data inserimento",
        value: "dataInserimento",
        groupable: false,
        editable: false,
        itemTextHandler: (value) => value.toLocaleDateString(),
      },
    ];
  }

  get actions(): Actions<Tuple> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: (item) => this.askDelete(item),
    };
  }

  /* METHODS */

  contrattoValueToTuple(contratto: ContrattiReturned): Tuple {
    return {
      id: contratto.id,
      dataInizio: contratto.dataInizio,
      dataFine: contratto.dataFine,
      nome: contratto.contrattiSuOspite?.[0].ospite?.persona?.nome ?? "",
      cognome: contratto.contrattiSuOspite?.[0].ospite?.persona?.cognome ?? "",
      codiceFabbricato: contratto.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto?.[0].postoLetto?.stanza?.fabbricato?.codice ?? "",
      unitaImmobiliare: contratto.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto?.[0].postoLetto?.stanza?.unitaImmobiliare ?? "",
      numeroStanza: contratto.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto?.[0].postoLetto?.stanza?.numeroStanza ?? "",
      postiLetto: contratto.contrattiSuOspite?.[0].contrattiSuOspiteSuPostoLetto
        ? contratto.contrattiSuOspite[0].contrattiSuOspiteSuPostoLetto.map((pl) => pl.postoLetto).join(", ")
        : "",
      dataInserimento: contratto.dataInserimento,
      reference: contratto,
    };
  }

  getIdFromValue(value: Tuple): number {
    return value.reference.id;
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

  updateBodyFromValue(value: Tuple): ContrattiReplaceBody {
    return {
      dataInizio: value.reference.dataInizio,
      dataFine: value.reference.dataFine,
      checkout: value.reference.checkout,
      cauzione: value.reference.cauzione,
      tipoRata: value.reference.tipoRata,
      idTariffa: value.reference.idTariffa,
      idTipoContratto: value.reference.idTipoContratto,
      idQuietanziante: value.reference.idQuietanziante,
      ospiti: value.reference.contrattiSuOspite
        ? value.reference.contrattiSuOspite.map((cso) => ({
            idOspite: cso.idOspite,
            postiLetto: cso.contrattiSuOspiteSuPostoLetto ? cso.contrattiSuOspiteSuPostoLetto.map((pl) => pl.idPostoLetto) : [],
          }))
        : [],
      note: value.reference.note,
    };
  }
  async tupleValueFromCreateBody(id: number, _body: ContrattiCreateBody): Promise<Tuple> {
    const contratto = await this.getContratto(id, {
      contrattiSuOspite: {
        ospite: { persona: true },
        contrattiSuOspiteSuPostoLetto: {
          postoLetto: true,
        },
      },
    });
    return this.contrattoValueToTuple(contratto);
  }
  async tupleValueFromUpdateBody(id: number, _body: ContrattiReplaceBody): Promise<Tuple> {
    const contratto = await this.getContratto(id, {
      contrattiSuOspite: {
        ospite: { persona: true },
        contrattiSuOspiteSuPostoLetto: {
          postoLetto: true,
        },
      },
    });
    return this.contrattoValueToTuple(contratto);
  }

  async fetchContratti(): Promise<void> {
    try {
      this.tableLoading = true;
      this.contratti = await this.getContrattiDaFirmare({
        contrattiSuOspite: {
          ospite: { persona: true },
          contrattiSuOspiteSuPostoLetto: {
            postoLetto: true,
          },
        },
        ...this.dateQueryParams,
      });
    } finally {
      this.tableLoading = false;
    }
  }

  /* WATCH */

  @Watch("contratti")
  watchContratti() {
    this.values = this.contratti.map((c) => this.contrattoValueToTuple(c));
  }

  @Watch("dateQueryParams", { deep: true })
  async watchDateQueryParams() {
    await this.fetchContratti();
  }

  /* LIFE CYCLE */

  async mounted() {
    await this.fetchContratti();
  }
}
</script>