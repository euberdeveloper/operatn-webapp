<template lang="pug">
v-card
  v-card-title.headline Controlli
  v-card-text Seleziona un intervallo di date
  v-container
    v-row.d-flex.align-end
      v-col
        v-date-picker.elevation-1(v-model='dates', :landscape='$vuetify.breakpoint.mdAndUp', range='', show-current='', first-day-of-week='1', locale='it-it')
      v-col(align='center')
        v-btn.primary.ma-1(:disabled='dates.length != 2', @click="checkin('in')") Visualizza check-in
        v-btn.primary.ma-1(:disabled='dates.length != 2', @click="checkin('out')") Visualizza check-out
      v-col(align='center')
        v-btn.primary.ma-1(:disabled='dates.length != 2', @click="contratti('in')") Visualizza Contratti che iniziano
        v-btn.primary.ma-1(:disabled='dates.length != 2', @click="contratti('out')") Visualizza Contratti che terminano
  v-data-table.elevation-1(:headers='headers', :items='items', :search='search', dense='')
    template(v-slot:top='')
      v-toolbar(flat='')
        v-toolbar-title Esporta tabella
        v-col
          v-btn.red.darken-2.white--text(v-if='items.length>0', @click='print()')
            v-icon(left='') mdi-file-pdf
            | PDF
          v-btn.green.darken-2.mx-2.white--text(v-if='items.length>0', @click='exportExcel()')
            v-icon(left='') mdi-file-excel
            | XLSX
      v-text-field.mx-3.mb-3(v-model='search', append-icon='mdi-magnify', label='Cerca', single-line='', hide-details='')
    template(v-slot:item.controls='props')
      v-btn.red.darken-2.white--text(small='', @click='contract_pdf(props.item)')
        v-icon(dark='') mdi-file-pdf

</template>

<script>
import { mapState, mapActions } from "vuex"
import XLSX from "xlsx"
import pdfQuestura from "@/utils/pdfQuestura"
export default {
  data() {
    return {
      search: ""
    }
  },

  computed: {
    ...mapState("controlli", ["items", "isLoading"]),
    headers() {
      let h = [
        "nome",
        "cognome",
        "sesso",
        "cittadinanza",
        "tel_cellulare",
        "e_mail",
        "fabbricato",
        "stanza",
        "inizio contratto",
        "fine contratto",
        "check in",
        "check out",
        "chiavi",
        "badge",
        "lenzuola"
      ].map(x => {
        return { text: x, value: x }
			})
			h.unshift({ text: "", value: "controls", sortable: false })
			return h
    },
    dates: {
      get() {
        return this.$store.state.controlli.dates
      },
      set(val) {
        this.$store.commit("controlli/setDates", val)
      }
    }
  },

  methods: {
		...mapActions("controlli", ["checkin", "contratti"]),
		contract_pdf(contract) {
			console.log(contract)
			pdfQuestura(contract)
		},
    print() {
      let pdfMake = require("pdfmake/build/pdfmake.js")
      if (pdfMake.vfs == undefined) {
        let pdfFonts = require("pdfmake/build/vfs_fonts.js")
        pdfMake.vfs = pdfFonts.pdfMake.vfs
      }
      let rows = [
        [
          "nome",
          "cognome",
          "s",
          "cittadinanza",
          "tel",
          "email",
          "fabbricato",
          "stanza",
          "inizio contratto",
          "fine contratto",
          "check in",
          "check out"
        ]
      ]
      this.items.forEach(i => {
        rows.push(
          [
            "nome",
            "cognome",
            "sesso",
            "cittadinanza",
            "tel_cellulare",
            "e_mail",
            "descrizione_fabbricato",
            "numero_stanza",
            "inizio contratto",
            "fine contratto",
            "check in",
            "check out"
          ].map(h => (i[h] ? i[h].trim() : ""))
        )
      })
      let docDefinition = {
        info: {
          author: "Software opera universitaria fornito da https://xamin.it"
        },
        pageOrientation: "landscape",
        defaultStyle: {
          fontSize: 9,
          bold: true
        },
        content: [
          {
            style: "tableExample",
            table: {
              headerRows: 1,
              body: rows
            }
          }
        ]
      }
      let name =
        this.$store.state.controlli.dates[0].toString() +
        "~" +
        this.$store.state.controlli.dates[1].toString() +
        ".pdf"
      pdfMake.createPdf(docDefinition).download(name)
    },
    exportExcel() {
      let getSubset = (obj, keys) =>
        keys.reduce((acc, curr) => {
          acc[curr] = obj[curr]
          return acc
        }, {})

      let foglio = XLSX.utils.json_to_sheet(
        this.items.map(x =>
          getSubset(x, [
            "nome",
            "cognome",
            "sesso",
            "cittadinanza",
            "tel_cellulare",
            "e_mail",
            "descrizione_fabbricato",
            "numero_stanza",
            "inizio contratto",
            "fine contratto",
            "check in",
            "check out",
            "chiavi",
            "badge",
            "lenzuola"
          ])
        )
      )
      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, foglio, "Foglio 1")
      let name = this.$store.state.controlli.dates[0].toString() + "~" + this.$store.state.controlli.dates[1].toString() + ".xlsx"
      XLSX.writeFile(wb, name)
    }
  }
}
</script>