<template>
  <v-card>
    <v-card-title class="headline font-weight-regular primary white--text">Tabellone</v-card-title>
    <v-card-text>
      <v-row class="mx-1 mt-3 py-0">
        <v-col class="py-0" cols="4" sm="4">
          <v-menu ref="menuStart" v-model="menuStart" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="startDateFormatted"
                label="Data inizio"
                hint="formato DD/MM/YYYY"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                @blur="startDate = parseDate(startDateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="startDate" no-title @input="menuStart = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="py-0" cols="4" sm="4">
          <v-menu ref="menuEnd" v-model="menuEnd" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="endDateFormatted"
                label="Data fine"
                hint="formato DD/MM/YYYY"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                @blur="endDate = parseDate(endDateFormatted)"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" no-title @input="menuEnd = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col class="py-0" cols="4" sm="4">
          <v-btn class="ma-2" :loading="loadingTsv" :disabled="!valid" color="success" @click="loadTsv">
            TSV
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
          <v-btn class="ma-2" :loading="loadingXlsx" :disabled="!valid" color="success" @click="loadXlsx">
            XLSX
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  data: function () {
    return {
      startDate: null,
      startDateFormatted: null,
      endDate: null,
      endDateFormatted: null,
      menuStart: false,
      menuEnd: false,
      modal: false,
      loadingTsv: false,
      loadingXlsx: false,
    };
  },
  watch: {
    startDate() {
      this.startDateFormatted = this.formatDate(this.startDate);
    },
    endDate() {
      this.endDateFormatted = this.formatDate(this.endDate);
    },
  },
  computed: {
    valid() {
      return this.startDate && this.endDate && !this.loadingTsv && !this.loadingXlsx;
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${day}/${month}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [day, month, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    downloadBlob(blob, extension) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `file.${extension}`);
      document.body.appendChild(link);
      link.click();
    },
    async loadTsv() {
      if (this.valid) {
        try {
          this.loadingTsv = true;
          const result = await Vue.prototype.$api.get(`/tabellone/tsv?startDate=${this.startDate}&endDate=${this.endDate}`, { responseType: "blob" });
          const fileBlob = result.data;
          this.downloadBlob(fileBlob, 'tsv');
        } catch (error) {
          console.error(error);
          alert("Errore");
        } finally {
          this.loadingTsv = false;
        }
      }
    },
    async loadXlsx() {
      if (this.valid) {
        try {
          this.loadingXlsx = true;
          const result = await Vue.prototype.$api.get(`/tabellone/xlsx?startDate=${this.startDate}&endDate=${this.endDate}`, { responseType: "blob" });
          const fileBlob = result.data;
          this.downloadBlob(fileBlob, 'xlsx');
        } catch (error) {
          console.error(error);
          alert("Errore");
        } finally {
          this.loadingXlsx = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>