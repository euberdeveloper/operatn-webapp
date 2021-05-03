<template>
  <operatn-base-resource-manager
    title="Utenti"
    description="Gestione dei utenti dell'opera. Attenzione, eliminare un utente elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Utenti"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="uid"
    tableSortBy="nomeUtente"
    tableMultiSort
    tableShowSelect
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo utente"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica utente"
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
      <operatn-utente-create-form v-if="showCreateDialog" v-model="createBody" :formValid.sync="createBodyValid" :utentiNomiUtente="utentiNomiUtente" class="mt-6" />
    </template>
    <template v-slot:editDialog>
      <operatn-utente-edit-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :utentiNomiUtente="utentiNomiUtente"
        :canChangePassword="isRoot"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Utente, UtentiCreateBody, UtentiReturned } from "operatn-api-client";

import { AlertType } from "@/store";
import { getRoleIcon } from "@/utils";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import UtenteHandlerMixin, { UtentiHandlerUpdateBody } from "@/mixins/handlers/UtenteHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnUtenteCreateForm from "@/components/gears/forms/OperatnUtenteCreateForm.vue";
import OperatnUtenteEditForm from "@/components/gears/forms/OperatnUtenteEditForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnUtenteCreateForm,
    OperatnUtenteEditForm,
  },
})
export default class Utenti extends Mixins<ResourceManagerMixin<UtentiReturned, UtentiCreateBody, UtentiHandlerUpdateBody, string> & UtenteHandlerMixin>(
  ResourceManagerMixin,
  UtenteHandlerMixin
) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo utente?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i utenti selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<Utente>[] {
    return [
      {
        text: "Nome utente",
        value: "nomeUtente",
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
          rules: [this.$validator.requiredText("Utente"), this.$validator.unique(this.utentiNomiUtente)],
        },
      },

      {
        text: "Email",
        value: "email",
        groupable: false,

        editable: true,
        onEditCancel: () => this.sprepareUpdateBody(),
        onEditClose: () => {},
        onEditSave: () => this.updateValue(),
        onEditOpen: (item) => {
          this.prepareUpdateBody(item);
        },
        editInput: {
          type: "email",
          label: "Modifica",
          hint: "Premi invio per salvare",
          counter: true,
          rules: [this.$validator.requiredText("Email"), this.$validator.email()],
        },
      },
      {
        text: "Ruolo",
        value: "ruolo",
        groupable: true,
        filterable: false,

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
          rules: [this.$validator.requiredText("Ruolo"), this.$validator.ruoloUtente()],
          items: this.$store.state.roles,
        },
        itemText: true,
        itemIcon: true,
        itemIconHandler: (value: string) => getRoleIcon(value) ?? "",
      },
      {
        text: "Data creazione",
        value: "dataCreazione",
        groupable: false,
        filterable: false,

        editable: false,
        itemTextHandler: (value: string) => new Date(value).toLocaleString(),
      },
    ];
  }

  get utentiNomiUtente(): string[] {
    return this.getUtentiNomiUtente(this.values, this.backupValue);
  }

  get actions(): Actions<Utente> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: (item) => this.askDelete(item),
    };
  }

  /* METHODS */

  getIdFromValue(value: UtentiReturned): string {
    return value.uid;
  }

  async deleteHandler(uid: string, isMultiple: boolean): Promise<void> {
    await this.deleteUtente(uid, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: UtentiCreateBody): Promise<string> {
    return this.createUtente(value);
  }

  async updateHandler(uid: string, value: UtentiHandlerUpdateBody, isTableEdit: boolean): Promise<void> {
    await this.updateUtente(uid, value, this.backupValue?.ruolo !== value.ruolo, !!value.password, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: UtentiReturned): UtentiHandlerUpdateBody {
    return {
      uid: value.uid,
      nomeUtente: value.nomeUtente,
      email: value.email,
      ruolo: value.ruolo,
      password: "",
    };
  }
  tupleValueFromCreateBody(uid: string, body: UtentiCreateBody): UtentiReturned {
    return {
      uid,
      nomeUtente: body.nomeUtente,
      email: body.email,
      ruolo: body.ruolo,
      dataCreazione: new Date(),
    };
  }
  tupleValueFromUpdateBody(uid: string, body: UtentiHandlerUpdateBody, backupValue?: UtentiReturned): UtentiReturned {
    return {
      uid,
      nomeUtente: body.nomeUtente as string,
      email: body.email as string,
      ruolo: body.ruolo,
      dataCreazione: (backupValue as UtentiReturned).dataCreazione,
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getUtenti();
  }
}
</script>