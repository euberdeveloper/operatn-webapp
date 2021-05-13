<template>
  <operatn-base-resource-manager
    :title="title"
    description="FABBRICATO NON TROVATO"
    :showTable="showTableAndActionButton"
    tableTitle="Stanze"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableMultiSort
    :tableGroupHeaders="groupHeaders"
    createDialogTitle="Nuova stanza"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica stanza"
    :editDialogShow.sync="showEditDialog"
    :editDialogDisabled="!updateBodyValid"
    :showActionButton="showTableAndActionButton"
    @fabCreateClick="openCreate"
    @fabDeleteClick="askDeleteMultiple"
    @createDialogConfirm="closeCreate(true)"
    @createDialogCancel="closeCreate(false)"
    @editDialogConfirm="closeEdit(true)"
    @editDialogCancel="closeEdit(false)"
  >
    <template v-slot:description>
      <v-expansion-panels v-if="fabbricato" v-model="detailsExpanded" class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-header> 
            <span class="text-h6">Dettagli fabbricato</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <operatn-fabbricato-info :value="fabbricato" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>

    <template v-slot:createDialog>
      <operatn-stanza-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-stanza-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Fabbricato, Stanza, TipoStanza } from "operatn-api-client";
import { StanzeCreateBody, StanzeReplaceBody } from "operatn-api-client/api/controllers/fabbricati/stanze/index";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import FabbricatoHandlerMixin from "@/mixins/handlers/FabbricatoHandlerMixin";
import StanzaHandlerMixin from "@/mixins/handlers/StanzaHandlerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnFabbricatoInfo from "@/components/gears/infos/OperatnFabbricatoInfo.vue";
import OperatnStanzaForm from "@/components/gears/forms/OperatnStanzaForm.vue";
import { GroupHeaders } from "@/components/gears/bases/OperatnBaseTable.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnFabbricatoInfo,
    OperatnStanzaForm
  },
})
export default class FabbricatiCodice extends Mixins<
  ResourceManagerMixin<Stanza, StanzeCreateBody, StanzeReplaceBody, number> & FabbricatoHandlerMixin & StanzaHandlerMixin & TipoStanzaHandlerMixin
>(ResourceManagerMixin, FabbricatoHandlerMixin, StanzaHandlerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  @Prop({ type: String, required: true })
  codice!: string;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questa stanza?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare le stanze selezionate?";

  private fabbricato: Fabbricato | null = null;
  private tipiStanza: TipoStanza[] = [];
  private detailsExpanded = 0;

  /* GETTERS AND SETTERS */

  get title(): string {
    return this.fabbricato ? `Fabbricato: ${this.fabbricato.nome}` : `Fabbricato: ${this.codice}`;
  }

  get showTableAndActionButton(): boolean {
    return this.fabbricato !== null;
  }

  get fid(): number {
    return this.fabbricato?.id as number;
  }

  get columns(): Column<Stanza>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Unità immobiliare",
        value: "unitaImmobiliare",
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
          clearable: true,
          counter: true,
          rules: [this.$validator.requiredText("Unità immobiliare")],
        },
      },
      {
        text: "Numero stanza",
        value: "numeroStanza",
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
          rules: [this.$validator.requiredText("Numero stanza")],
        },
      },
      {
        text: "Tipo stanza",
        value: "idTipoStanza",
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
          rules: [this.$validator.requiredText("Tipo stanza")],
        },

        itemTextHandler: (id) => this.tipiStanza.find((v) => v.id === id)?.tipoStanza ?? "NON TROVATO",
      },
      {
        text: "Piano",
        value: "piano",
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
          items: this.piani,
          itemText: "label",
          itemValue: "piano",
          rules: [this.$validator.requiredText("Piano")],
        },

        itemTextHandler: (piano) => this.piani.find((v) => v.piano === piano)?.label ?? "NON TROVATO",
      },
      {
        text: "Centro di costo",
        value: "centroDiCosto",
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
          rules: [this.$validator.requiredText("Centro di costo")],
        },
      },
      {
        text: "Bagno",
        value: "bagno",
        groupable: true,
        editable: false,
        itemText: false,
        itemIcon: true,
        itemIconHandler: (value) => (value ? "mdi-toilet" : "mdi-close"),
      },
      {
        text: "Handicap",
        value: "handicap",
        groupable: true,
        editable: false,
        itemText: false,
        itemIcon: true,
        itemIconHandler: (value) => (value ? "mdi-wheelchair-accessibility" : "mdi-close"),
      },
    ];
  }

  get actions(): Actions<Stanza> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined
    };
  }

  get groupHeaders(): GroupHeaders {
    return {
      keyHandler: (key) => (key === "idTipoStanza" ? "TIPO STANZA" : key),
      valueHandler: (value, key) => (key === "idTipoStanza" ? this.tipiStanza.find((v) => v.id === +value)?.tipoStanza ?? "NON TROVATO" : value),
    };
  }

  get piani() {
    return this.$store.state.piani;
  }

  /* METHODS */

  getIdFromValue(value: Stanza): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteStanza(this.fid, id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: StanzeCreateBody): Promise<number> {
    return this.createStanza(this.fid, value);
  }

  async updateHandler(id: number, value: StanzeReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateStanza(this.fid, id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: Stanza): StanzeReplaceBody {
    return {
      unitaImmobiliare: value.unitaImmobiliare,
      numeroStanza: value.numeroStanza,
      piano: value.piano,
      bagno: value.bagno,
      centroDiCosto: value.centroDiCosto,
      gestioneDiretta: value.gestioneDiretta,
      handicap: value.handicap,
      note: value.note,
      idTipoStanza: value.idTipoStanza,
    };
  }
  tupleValueFromCreateBody(id: number, body: StanzeCreateBody): Stanza {
    return {
      id,
      idFabbricato: this.fid,
      unitaImmobiliare: body.unitaImmobiliare,
      numeroStanza: body.numeroStanza,
      piano: body.piano,
      bagno: body.bagno,
      centroDiCosto: body.centroDiCosto,
      gestioneDiretta: body.gestioneDiretta,
      handicap: body.handicap,
      note: body.note,
      idTipoStanza: body.idTipoStanza,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }
  tupleValueFromUpdateBody(id: number, body: StanzeReplaceBody): Stanza {
    return {
      id,
      idFabbricato: this.fid,
      unitaImmobiliare: body.unitaImmobiliare,
      numeroStanza: body.numeroStanza,
      piano: body.piano,
      bagno: body.bagno,
      centroDiCosto: body.centroDiCosto,
      gestioneDiretta: body.gestioneDiretta,
      handicap: body.handicap,
      note: body.note,
      idTipoStanza: body.idTipoStanza,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.fabbricato = await this.getFabbricatoByCodice(this.codice, { tipoFabbricato: true });
    this.values = await this.getStanze(this.fabbricato.id);
    this.tipiStanza = await this.getTipiStanza();
  }
}
</script>