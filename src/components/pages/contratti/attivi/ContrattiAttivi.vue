<template>
  <div>
    <operatn-base-resource-manager
      title="Contratti attivi"
      description="Visualizzazione dei contratti attualmente attivi."
      :isCard="false"
      tableTitle="Contratti"
      :tableSelectedValues.sync="selectedValues"
      :tableColumns="columns"
      :tableActions="actions"
      :tableValues="values"
      tableItemKey="id"
      :tableLoading="tableLoading"
      :tableUpdateBody.sync="updateBody"
      :tableShowTitle="false"
      createDialogTitle="Nuovo contratto"
      :createDialogShow.sync="showCreateDialog"
      :createDialogDisabled="!createBodyValid"
      editDialogTitle="Modifica contratto"
      :editDialogShow.sync="showEditDialog"
      :editDialogDisabled="!updateBodyValid"
      dialogWidth="80vw"
      @fabCreateClick="openCreate"
      @fabDeleteClick="askDeleteMultiple"
      @createDialogConfirm="closeCreate(true)"
      @createDialogCancel="closeCreate(false)"
      @editDialogConfirm="closeEdit(true)"
      @editDialogCancel="closeEdit(false)"
    >
      <template v-slot:tableHeader>
        <span class="mx-4" />
        <operatn-date-input placeholder="Inizia dopo il" style="flex: 1" name="dataInizio" dense hideDetails clearable v-model="dateQueryParams.dataInizio" />
        <span class="mx-4" />
        <operatn-date-input placeholder="Finisce prima del" style="flex: 1" name="dataFine" dense hideDetails clearable v-model="dateQueryParams.dataFine" />
        <span class="mx-4" />
        <operatn-ospite-input placeholder="Ospite" name="idOspite" dense hideDetails clearable v-model="dateQueryParams.idOspite" />
        <span class="mx-4" />
      </template>
      <template v-slot:createDialog>
        <operatn-contratto-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" class="mt-6" />
      </template>
      <template v-slot:editDialog>
        <operatn-contratto-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" class="mt-6" />
      </template>
      <template v-slot:selectFab>
        <v-btn color="accent" @click="selectButtonPressed" fab large fixed bottom right>
          <v-icon>{{ selectAction === "pdf" ? "mdi-file-pdf" : "mdi-email-send" }}</v-icon>
        </v-btn>
      </template>
    </operatn-base-resource-manager>

    <operatn-action-dialog
      title="Chiudi contratto"
      v-model="showChiudiDialog"
      :disabled="!contrattoChiusoValid"
      @cancel="chiudiDialogCancel"
      @confirm="chiudiDialogConfirm"
    >
      <operatn-contratto-chiudi-form
        v-if="showChiudiDialog"
        v-model="contrattoChiuso"
        :formValid.sync="contrattoChiusoValid"
        :dataInizioContratto="contrattoDaChiudere.dataInizio"
        :dataFineContratto="contrattoDaChiudere.dataFine"
        class="mt-6"
      />
    </operatn-action-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiFilterParams, ContrattiReplaceBody, ContrattiReturned } from "operatn-api-client";
import axios from "axios";

import { ActionTypes, AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import ContrattoHandlerMixin from "@/mixins/handlers/ContrattoHandlerMixin";

import { downloadBlob } from "@/utils";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnContrattoChiudiForm from "@/components/gears/forms/contratto/OperatnContrattoChiudiForm.vue";
import OperatnContrattoForm from "@/components/gears/forms/contratto/OperatnContrattoForm.vue";
import OperatnDateInput from "@/components/gears/inputs/OperatnDateInput.vue";
import OperatnOspiteInput from "@/components/gears/inputs/OperatnOspiteInput.vue";

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
  dataFirma: Date | null;
  dataChiusuraAnticipata: Date | null;
  reference: ContrattiReturned;
}

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnContrattoForm,
    OperatnContrattoChiudiForm,
    OperatnDateInput,
    OperatnOspiteInput,
  },
})
export default class ContrattiAttivi extends Mixins<ResourceManagerMixin<Tuple, ContrattiCreateBody, ContrattiReplaceBody, number> & ContrattoHandlerMixin>(
  ResourceManagerMixin,
  ContrattoHandlerMixin
) {
  /* DATA */

  private contratti: ContrattiReturned[] = [];
  private dateQueryParams: ContrattiFilterParams = {
    dataInizio: undefined,
    dataFine: undefined,
    idOspite: undefined,
  };
  private tableLoading = false;

  private contrattoDaChiudere: Tuple | null = null;
  private contrattoChiuso: Date | null = null;
  private contrattoChiusoValid = false;
  private showChiudiDialog = false;

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
        text: "N. stanza",
        value: "numeroStanza",
        groupable: false,
        editable: false,
      },
      {
        text: "Data firma",
        value: "dataFirma",
        groupable: false,
        editable: false,
        itemTextHandler: (value) => (value ? value.toLocaleDateString() : ""),
      },
      {
        text: "Chiusura anticipata",
        value: "dataChiusuraAnticipata",
        groupable: false,
        editable: false,
        itemTextHandler: (value) => (value ? value.toLocaleDateString() : ""),
      },
    ];
  }

  get actions(): Actions<Tuple> {
    return {
      others: [
        {
          icon: "mdi-download",
          color: "indigo",
          action: (item) => this.downloadContratto(item),
        },
        {
          icon: "mdi-close-circle",
          color: "error",
          action: (item) => this.openChiudiContratto(item),
          showAction: (item) => item.dataChiusuraAnticipata === null
        },
      ],
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
      dataFirma: contratto.dataFirmaContratto,
      dataChiusuraAnticipata: contratto.dataChiusuraAnticipata,
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
      checkout: !!value.reference.checkout,
      cauzione: !!value.reference.cauzione,
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
  async tupleValueFromCreateBody(id: number): Promise<Tuple> {
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
  async tupleValueFromUpdateBody(id: number): Promise<Tuple> {
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

  openChiudiContratto(tuple: Tuple): void {
    this.contrattoDaChiudere = tuple;
    this.showChiudiDialog = true;
    this.contrattoChiuso = null;
    this.contrattoChiusoValid = false;
  }
  chiudiDialogCancel(): void {
    this.showChiudiDialog = false;
    this.contrattoDaChiudere = null;
    this.contrattoChiuso = null;
  }
  async chiudiDialogConfirm(): Promise<void> {
    if (this.contrattoChiusoValid) {
      try {
        await this.closeContrattoInAnticipo(this.contrattoDaChiudere?.id as number, { dataChiusura: this.contrattoChiuso as Date });
      } finally {
        this.chiudiDialogCancel();
      }
    } else {
      this.chiudiDialogCancel();
    }
  }

  async downloadContratto(tuple: Tuple): Promise<void> {
    try {
      const filename = `${tuple.id}.pdf`;
      const path = this.$stored.getPath(`contratti/${filename}`);
      const response = await axios.get(path, { responseType: "blob" });
      const blob: Blob = response.data;
      downloadBlob(blob, filename);
    } catch (error) {
      this.$store.dispatch(ActionTypes.ALERT, { message: `File non trovato`, alertType: AlertType.ERRORS_QUEUE });
    }
  }

  async fetchContratti(): Promise<void> {
    try {
      this.tableLoading = true;
      this.contratti = await this.getContrattiAttivi({
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