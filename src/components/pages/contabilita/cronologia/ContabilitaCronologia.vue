<template>
  <v-card flat>
    <v-card-text>
      Qui puoi vedere e scaricare la cronologia delle bollette contabilizzate. Puoi scaricare in tsv, excel (in cui le bollette fallite sono rosse e quelle inviate verdi)
      o xml (come vengono inviate al server della contabilità, per debug)
    </v-card-text>
    <operatn-base-table title="Bollette contabilità" :columns="columns" :actions="actions" :values="tuples" itemKey="path" sortBy="path" />
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { ContabilitaDirsInfo } from "operatn-api-client";
import axios from "axios";

import ContabilitaHandlerMixin from "@/mixins/handlers/ContabilitaHandlerMixin";
import OperatnBaseTable, { Actions, Column } from "@/components/gears/bases/OperatnBaseTable.vue";
import { downloadBlob } from "@/utils";
import { ActionTypes, AlertType } from "@/store";

interface Tuple {
  path: string;
  date: Date;
}

@Component({
  components: {
    OperatnBaseTable,
  },
})
export default class ContabilitaCronologia extends Mixins(ContabilitaHandlerMixin) {
  /* DATA */

  private dirsInfo: ContabilitaDirsInfo[] = [];
  private columns: Column<Tuple>[] = [
    {
      text: "Nome file",
      value: "path",
      groupable: false,
      editable: false,
    },
    {
      text: "Data",
      value: "date",
      groupable: false,
      editable: false,
      itemTextHandler: (value: Date) => value.toLocaleString(),
    },
  ];

  private actions: Actions<Tuple> = {
    others: [
      {
        icon: "mdi-table-large",
        color: "success",
        action: (value) => this.downloadContabilita(value.path, "tsv"),
      },
      {
        icon: "mdi-google-spreadsheet",
        color: "success",
        action: (value) => this.downloadContabilita(value.path, "xlsx"),
      },
      {
        icon: "mdi-xml",
        color: "warning",
        action: (value) => this.downloadContabilita(value.path, "xml"),
      },
    ],
  };

  /* GETTERS */

  get tuples(): Tuple[] {
    function getDate(path: string): Date {
      const matched = /^contabilita__(?<year>\d{4})_(?<month>\d{2})_(?<day>\d{2})__\d+.\w+$/.exec(path);
      const groups = matched?.groups as Record<string, string>;
      return new Date(+groups.year, +groups.month, +groups.day);
    }

    return this.dirsInfo.map((el) => ({
      path: el.path,
      date: getDate(el.path),
    }));
  }

  /* METHODS */

  async downloadContabilita(dirname: string, extension: string): Promise<void> {
    try {
      const filename = `${dirname}.${extension}`;
      const path = this.$stored.getPath(`contabilita/${dirname}/${filename}`);
      const response = await axios.get(path, { responseType: "blob" });
      const blob: Blob = response.data;
      downloadBlob(blob, filename);
    } catch (error) {
      this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nello scaricare contabilità.`, alertType: AlertType.ERRORS_QUEUE });
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    this.dirsInfo = await this.getContabilitaCronology();
  }
}
</script>

