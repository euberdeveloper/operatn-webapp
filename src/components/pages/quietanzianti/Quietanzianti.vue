<template>
  <operatn-base-resource-manager
    title="Quietanzianti"
    description="Gestione dei quietanzianti dell'opera. Attenzione, eliminare un quietanziante elimina a cascata tutti i fabbricati ed i contratti ad esso associati."
    tableTitle="Quietanzianti"
    :tableSelectedValues.sync="selectedValues"
    :tableColumns="columns"
    :tableActions="actions"
    :tableValues="values"
    tableItemKey="id"
    :tableShowSelect="isRoot"
    :tableUpdateBody.sync="updateBody"
    createDialogTitle="Nuovo quietanziante"
    :createDialogShow.sync="showCreateDialog"
    :createDialogDisabled="!createBodyValid"
    editDialogTitle="Modifica quietanziante"
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
      <operatn-quietanziante-form
        v-if="showCreateDialog"
        v-model="createBody"
        :formValid.sync="createBodyValid"
        :quietanziantiValues="quietanziantiValues"
        class="mt-6"
      />
    </template>
    <template v-slot:editDialog>
      <operatn-quietanziante-form
        v-if="showEditDialog"
        v-model="updateBody"
        :formValid.sync="updateBodyValid"
        :quietanziantiValues="quietanziantiValues"
        class="mt-6"
      />
    </template>
  </operatn-base-resource-manager>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import { Quietanziante, QuietanziantiCreateBody, QuietanziantiReplaceBody } from "operatn-api-client";

import { AlertType } from "@/store";
import ResourceManagerMixin from "@/mixins/ResourceManagerMixin";
import QuietanzianteHandlerMixin from "@/mixins/handlers/QuietanzianteHandlerMixin";

import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnBaseResourceManager, { Column, Actions } from "@/components/gears/bases/OperatnBaseResourceManager.vue";
import OperatnQuietanzianteForm from "@/components/gears/forms/OperatnQuietanzianteForm.vue";

@Component({
  components: {
    OperatnActionDialog,
    OperatnBaseResourceManager,
    OperatnQuietanzianteForm,
  },
})
export default class Quietanzianti extends Mixins<
  ResourceManagerMixin<Quietanziante, QuietanziantiCreateBody, QuietanziantiReplaceBody, number> & QuietanzianteHandlerMixin
>(ResourceManagerMixin, QuietanzianteHandlerMixin) {
  /* PROPS */

  @Prop({ type: Boolean, required: true })
  isRoot!: boolean;

  /* DATA */

  protected askDeleteText = "Sei sicuro di voler eliminare questo quietanziante?";
  protected askDeleteMultipleText = "Sei sicuro di voler eliminare i quietanzianti selezionati?";

  /* GETTERS AND SETTERS */

  get columns(): Column<Quietanziante>[] {
    return [
      {
        text: "ID",
        value: "id",
        groupable: false,
        editable: false,
      },
      {
        text: "Quietanziante",
        value: "quietanziante",
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
          rules: [this.$validator.requiredText("Quietanziante"), this.$validator.unique(this.quietanziantiValues)],
        },
      },
      {
        text: "Denominazione",
        value: "denominazione",
        groupable: false,
        editable: false,
        itemTextHandler: value => value ?? '[NULL]'
      },
    ];
  }

  get quietanziantiValues(): string[] {
    return this.getQuietanziantiValues(this.values, this.backupValue);
  }

  get actions(): Actions<Quietanziante> {
    return {
      onEdit: (item) => this.openEdit(item),
      onDelete: this.isRoot ? ((item) => this.askDelete(item)) : undefined,
    };
  }

  /* METHODS */

  getIdFromValue(value: Quietanziante): number {
    return value.id;
  }

  async deleteHandler(id: number, isMultiple: boolean): Promise<void> {
    await this.deleteQuietanziante(id, isMultiple ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  async createHandler(value: QuietanziantiCreateBody): Promise<number> {
    return this.createQuietanziante(value);
  }

  async updateHandler(id: number, value: QuietanziantiReplaceBody, isTableEdit: boolean): Promise<void> {
    await this.updateQuietanziante(id, value, isTableEdit ? AlertType.ERRORS_QUEUE : AlertType.ERROR_ALERT);
  }

  updateBodyFromValue(value: Quietanziante): QuietanziantiReplaceBody {
    return {
      quietanziante: value.quietanziante,
      denominazione: value.denominazione,
      sesso: value.sesso,
      dataNascita: value.dataNascita,
      comuneNascita: value.comuneNascita,
      indirizzo: value.indirizzo,
      cap: value.cap,
      citta: value.citta,
      siglaProvincia: value.siglaProvincia,
      codiceFiscale: value.codiceFiscale,
      numeroTelefono: value.numeroTelefono,
      email: value.email
    };
  }
  tupleValueFromCreateBody(id: number, body: QuietanziantiCreateBody): Quietanziante {
    return {
      id,
      quietanziante: body.quietanziante,
      denominazione: body.denominazione,
      sesso: body.sesso,
      dataNascita: body.dataNascita,
      comuneNascita: body.comuneNascita,
      indirizzo: body.indirizzo,
      cap: body.cap,
      citta: body.citta,
      siglaProvincia: body.siglaProvincia,
      codiceFiscale: body.codiceFiscale,
      numeroTelefono: body.numeroTelefono,
      email: body.email
    };
  }
  tupleValueFromUpdateBody(id: number, body: QuietanziantiReplaceBody): Quietanziante {
    return {
      id,
      quietanziante: body.quietanziante,
      denominazione: body.denominazione,
      sesso: body.sesso,
      dataNascita: body.dataNascita,
      comuneNascita: body.comuneNascita,
      indirizzo: body.indirizzo,
      cap: body.cap,
      citta: body.citta,
      siglaProvincia: body.siglaProvincia,
      codiceFiscale: body.codiceFiscale,
      numeroTelefono: body.numeroTelefono,
      email: body.email
    };
  }

  /* LIFE CYCLE */

  async mounted() {
    this.values = await this.getQuietanzianti();
  }
}
</script>