<template>
  <v-card flat>
    <v-card-text> Qui puoi vedere e scaricare la cronologia dei vecchi tabelloni salvati ed inviati via email. </v-card-text>
    <operatn-base-table title="Tabelloni" :columns="columns" :actions="actions" :values="filesInfos" itemKey="path" sortBy="path" />
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { FilesInfo } from "operatn-api-client";
import axios from "axios";

import TabelloneHandlerMixin from "@/mixins/handlers/TabelloneHandlerMixin";
import OperatnBaseTable, { Actions, Column } from "@/components/gears/bases/OperatnBaseTable.vue";
import { downloadBlob } from "@/utils";
import { ActionTypes, AlertType } from "@/store";

@Component({
  components: {
    OperatnBaseTable,
  },
})
export default class TabelloneCronologia extends Mixins(TabelloneHandlerMixin) {
  /* DATA */

  private filesInfos: FilesInfo[] = [];
  private columns: Column<FilesInfo>[] = [
    {
      text: "Nome",
      value: "path",
      groupable: false,
      editable: false,
    },
    {
      text: "Estensione",
      value: "extension",
      groupable: false,
      editable: false,
    },
    {
      text: "Dimensione",
      value: "size",
      groupable: false,
      editable: false,
    },
  ];

  private actions: Actions<FilesInfo> = {
    others: [
      {
        icon: "mdi-google-spreadsheet",
        color: "success",
        action: (item) => this.downloadTabellone(item.path),
      },
    ],
  };

  /* METHODS */

  async downloadTabellone(filename: string): Promise<void> {
    try {
      const path = this.$stored.getPath(`tabellone/${filename}`);
      const response = await axios.get(path, { responseType: "blob" });
      const blob: Blob = response.data;
      downloadBlob(blob, filename);
    } catch (error) {
      this.$store.dispatch(ActionTypes.ALERT, { message: `Errore nello scaricare tabellone.`, alertType: AlertType.ERRORS_QUEUE });
    }
  }

  /* LIFE CYCLE */

  async mounted() {
    this.filesInfos = await this.getTabelloneCronology();
  }
}
</script>

