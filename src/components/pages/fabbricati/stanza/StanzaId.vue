<template>
  <operatn-base-resource-manager
    :title="title"
    description="STANZA NON TROVATA"
    :showTable="showTableAndActionButton"
    tableTitle="Posti letto"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    tableMultiSort
    createDialogTitle="Nuovo posto letto"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica posto letto"
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
      <v-expansion-panels v-if="stanza" v-model="detailsExpanded" class="mt-4">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <span class="text-h6">Dettagli stanza</span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <operatn-stanza-info :value="stanza" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>

    <template v-slot:createDialog>
      <operatn-posto-letto-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :postiLettoValues="postiLettoValues" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-posto-letto-form v-if="showEditDialog" v-model="updateBody" :formValid.sync="updateBodyValid" :postiLettoValues="postiLettoValues" class="mt-6" />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { PostiLettoCreateBody, PostiLettoReplaceBody, PostiLettoReturned, StanzeReturned } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import StanzaHandlerMixin from "@/mixins/handlers/StanzaHandlerMixin";
import PostoLettoHandlerMixin from "@/mixins/handlers/PostoLettoHandlerMixin";
import TipoStanzaHandlerMixin from "@/mixins/handlers/TipoStanzaHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnStanzaInfo from "@/components/gears/infos/OperatnStanzaInfo.vue";
import OperatnPostoLettoForm from "@/components/gears/forms/OperatnPostoLettoForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnStanzaInfo,
    OperatnPostoLettoForm,
  },
})
export default class StanzaId extends Mixins<
  ResourceManagerMixin<PostiLettoReturned, PostiLettoCreateBody, PostiLettoReplaceBody, number> & PostoLettoHandlerMixin & StanzaHandlerMixin & TipoStanzaHandlerMixin
>(ResourceManagerMixin, PostoLettoHandlerMixin, StanzaHandlerMixin, TipoStanzaHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  @Prop({ type: Number, required: true })
  fid!: number;

  @Prop({ type: Number, required: true })
  sid!: number;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo postoLetto?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i posti letto selezionati?";

  private stanza: StanzeReturned | null = null;
  private detailsExpanded = 0;

  /* GETTERS AND SETTERS */

  get title(): string {
    return this.stanza ? `Stanza: ${this.stanza.unitaImmobiliare} - ${this.stanza.numeroStanza}` : `Stanza: ${this.sid}`;
  }

  get showTableAndActionButton(): boolean {
    return this.stanza !== null;
  }

  get columns(): Column<PostiLettoReturned>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Posto letto",
        value: "postoLetto",
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
          rules: [this.$validator.requiredText("Posto letto"), this.$validator.unique(this.postiLettoValues)],
        },
      },
    ];
  }

  get actions(): Actions<PostiLettoReturned> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? (item) => this.askDelete(item) : undefined,
    };
  }

  get postiLettoValues(): string[] {
    return this.getPostiLettoValues(this.values, this.backupValue);
  }

  /* METHODS */

  getIdFromValue(value: PostiLettoReturned): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deletePostoLetto(this.fid, this.sid, id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: PostiLettoCreateBody): Promise<number> {
    return this.createPostoLetto(this.fid, this.sid, value);
  }

  async updateHandler(id: number, value: PostiLettoReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updatePostoLetto(this.fid, this.sid, id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: PostiLettoReturned): PostiLettoReplaceBody {
    return {
      postoLetto: value.postoLetto,
    };
  }
  tupleValueFromCreateBody(id: number, body: PostiLettoCreateBody): PostiLettoReturned {
    return {
      id,
      idStanza: this.sid,
      postoLetto: body.postoLetto,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }
  tupleValueFromUpdateBody(id: number, body: PostiLettoReplaceBody): PostiLettoReturned {
    return {
      id,
      idStanza: this.sid,
      postoLetto: body.postoLetto,
      dataCreazione: this.backupValue?.dataCreazione ?? new Date(),
      eliminato: null,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.stanza = await this.getStanza(this.fid, this.sid, { tipoStanza: true, postiLetto: true, manutenzioni: true, fabbricato: true as any });
    this.values = await this.getPostiLetto(this.fid, this.sid);
  }
}
</script>