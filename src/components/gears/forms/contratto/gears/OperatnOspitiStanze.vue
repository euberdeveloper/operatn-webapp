<template>
  <v-container>
    <operatn-base-table title="Ospiti e posti letto" :columns="columns" :actions="actions" :values="tuples">
      <template v-slot:header>
        <v-spacer />
        <v-btn color="primary" @click="showDialog = true" :disabled="!internalValue.dataInizio || !internalValue.dataFine">AGGIUNGI</v-btn>
      </template>
    </operatn-base-table>
    <operatn-action-dialog title="Aggiungi ospite e posto letto" v-model="showDialog" @cancel="dialogCancel" @confirm="dialogConfirm" :disabled="!addFormValid">
      <operatn-ospite-stanza
        v-model="ospitePostoLettoBody"
        :formValid.sync="addFormValid"
        :dataInizio="internalValue.dataInizio"
        :dataFine="internalValue.dataFine"
        v-if="showDialog"
      />
    </operatn-action-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { ContrattiCreateBody, ContrattiReplaceBody, OspitiReturned } from "operatn-api-client";

import OspiteHandlerMixin from "@/mixins/handlers/OspiteHandlerMixin";
import PostoLettoHandlerMixin from "@/mixins/handlers/PostoLettoHandlerMixin";

import OperatnBaseTable, { Actions, Column } from "@/components/gears/bases/OperatnBaseTable.vue";
import OperatnActionDialog from "@/components/gears/dialogs/OperatnActionDialog.vue";
import OperatnOspiteStanza, { Value } from "./OperatnOspiteStanza.vue";
import { AlertType } from "@/store";

interface Tuple {
  nomeOspite: string;
  cognomeOspite: string;
  sessoOspite: string;
  codiceFabbricato: string;
  nomeFabbricato: string;
  unitaImmobiliare: string;
  numeroStanza: string;
  postiLetto: string;
}

@Component({
  model: {
    prop: "value",
    event: "save",
  },
  components: {
    OperatnBaseTable,
    OperatnOspiteStanza,
    OperatnActionDialog,
  },
})
export default class OperatnOspitiStanze extends Mixins(OspiteHandlerMixin, PostoLettoHandlerMixin) {
  /* PROPS */

  @Prop({ type: Object, default: null })
  value!: Partial<ContrattiCreateBody> | Partial<ContrattiReplaceBody>;

  @Prop({ type: Boolean, default: false })
  formValid!: boolean;

  /* DATA */

  private ospitiPostiLetto: Value[] = [];
  private ospitePostoLettoBody: Value | null = null;
  private showDialog = false;
  private addFormValid = false;

  private columns: Column<Tuple>[] = [
    {
      text: "Nome",
      value: "nomeOspite",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Cognome",
      value: "cognomeOspite",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Sesso",
      value: "sessoOspite",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Codice fabbricato",
      value: "codiceFabbricato",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Nome fabbricato",
      value: "nomeFabbricato",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Unità immobiliare",
      value: "unitaImmobiliare",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Numero stanza",
      value: "numeroStanza",
      groupable: false,
      editable: false,
      sortable: false,
    },
    {
      text: "Posti letto",
      value: "postiLetto",
      groupable: false,
      editable: false,
      sortable: false,
    },
  ];
  private actions: Actions<Tuple> = {
    onDelete: (_, index) => {
      this.ospitiPostiLetto.splice(index, 1);
    },
  };

  /* GETTERS AND SETTERS */

  get internalValue() {
    return this.value;
  }
  set internalValue(value) {
    this.$emit("save", value);
  }

  get internalFormValid() {
    return this.formValid;
  }
  set internalFormValid(value) {
    this.$emit("update:formValid", value);
  }

  get tuples(): Tuple[] {
    return this.ospitiPostiLetto.map((el) => this.valueToTuple(el));
  }

  /* METHODS */

  valueToTuple(value: Value): Tuple {
    return {
      nomeOspite: value.ospite?.nome ?? "",
      cognomeOspite: value.ospite?.cognome ?? "",
      sessoOspite: value.ospite?.sesso ?? "",
      codiceFabbricato: value.postiLetto[0].codiceFabbricato,
      nomeFabbricato: value.postiLetto[0].nomeFabbricato,
      unitaImmobiliare: value.postiLetto[0].unitaImmobiliare,
      numeroStanza: value.postiLetto[0].numeroStanza,
      postiLetto: value.postiLetto.map((pl) => pl.postoLetto).join(", "),
    };
  }

  dialogCancel(): void {
    this.ospitePostoLettoBody = null;
  }

  dialogConfirm(): void {
    if (this.addFormValid) {
      this.ospitiPostiLetto.push(this.ospitePostoLettoBody as Value);
    }
    this.ospitePostoLettoBody = null;
    this.showDialog = false;
  }

  /* WATCH */

  @Watch("ospitiPostiLetto")
  async watchOspitiPostiLetto() {
    this.internalValue.ospiti = this.ospitiPostiLetto.map((el) => ({
      idOspite: (el.ospite as OspitiReturned).id,
      postiLetto: el.postiLetto.map((pl) => pl.idPostoLetto),
    }));

    this.$emit("update:formValid", !!this.internalValue.ospiti.length);
  }

  /* LIFE CYCLE */

  async mounted() {
    if (this.internalValue.ospiti?.length) {
      this.ospitiPostiLetto = await Promise.all(
        this.internalValue.ospiti.map(async (el) => {
          const ospite = await this.getOspite(el.idOspite, { persona: true }, AlertType.ERRORS_QUEUE);
          const postiLetto = await Promise.all(el.postiLetto.map(async (pl) => this.getPostoLettoGeneral(pl, { stanza: { fabbricato: true } }, AlertType.ERRORS_QUEUE)));
          return {
            ospite,
            postiLetto: postiLetto.map((pl) => ({
              idPostoLetto: pl.id,
              postoLetto: pl.postoLetto,
              idStanza: pl.idStanza,
              unitaImmobiliare: pl.stanza?.unitaImmobiliare ?? '',
              numeroStanza:  pl.stanza?.numeroStanza ?? '',
              idFabbricato:  pl.stanza?.idFabbricato ?? -1,
              codiceFabbricato:  pl.stanza?.fabbricato?.codice ?? '',
              nomeFabbricato: pl.stanza?.fabbricato?.nome ?? '',
            })),
          };
        })
      );
    }
  }
}
</script>