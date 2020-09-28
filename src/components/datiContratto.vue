<template lang="pug">
div
  v-expand-transition
    v-tabs(:vertical="$vuetify.breakpoint.mdAndUp", center-active)
      v-tab
        v-icon(dense, left) mdi-lock
        | Prenotazione
      v-tab
        v-icon(dense, left) mdi-plus
        | Altri Dati
      v-tab
        v-icon(dense, left) mdi-bike
        | Biciclette
      v-tab-item.pa-2
        v-container
          v-form(v-model="validDate")
            v-row.mx-2.mt-2
              v-col
                input-date-picker(
                  :readonly="v.contabilizzato",
                  v-model="v.inizio",
                  dense,
                  label="Inizio",
                  :rules="notNullRule",
                  required
                )
              v-col
                input-date-picker(
                  :readonly="v.contabilizzato",
                  v-model="v.fine",
                  dense,
                  label="Fine",
                  :rules="notNullRule",
                  required
                )
              v-col
                input-date-picker(
                  v-if="v.contabilizzato",
                  v-model="v.chiusura",
                  dense,
                  label="Chiusura"
                )
                v-btn.red.white--text(v-else, @click="deleteContract")
                  v-icon(left, dense) mdi-delete-forever
                  |
                  | {{ deleteBtnText }}
        v-form(v-if="validDate")
          v-card.my-2(outlined)
            v-card-text
              div Dati Utente
            v-icon.chevron(
              style="position: absolute;right: 12pt; top:8pt;",
              @click="expandCollapse(0)"
            ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
            v-expand-transition
              div(v-show="expand_sections[0] === true")
                v-row.mx-0.my-0.py-0
                  v-col.py-0.px-0
                    user-select(
                      return-object,
                      hide-no-data,
                      dense,
                      prepend-icon="mdi-account",
                      v-model="v.persona",
                      :readonly="v.contabilizzato",
                      :start-date="v.inizio",
                      :end-date="v.fine"
                    )
                v-row.mx-1.mt-3.py-0(v-if="!!v.persona")
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      v-model="v.persona.cognome",
                      dense,
                      label="Cognome"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.nome",
                      label="Nome"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.data_nascita",
                      label="Data Nascita"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.email",
                      label="E-mail"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.telefono",
                      label="Telefono"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.sesso",
                      label="Sesso"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      readonly,
                      dense,
                      v-model="v.persona.facolta",
                      label="Cod. Dipartimento"
                    )
                  //- v-col.py-0(cols='12', sm='5', md='4')
                  //-   v-text-field(readonly, dense, label='Credito Canoni')
                  //- v-col.py-0(cols='12', sm='5', md='4')
                  //-   v-text-field(readonly, dense, label='Credito Consumi')
                  //- v-col.py-0(cols='12', md='4')
                  //-   v-checkbox.mt-0(readonly, dense, label='Utilizzo Credito per Compensazione Rate?')
                  //- v-col.py-0(cols='12', sm='6')
                  //-   v-text-field(readonly, dense, label='Quietanzante')
                  //- v-col.py-0(cols='12', sm='6')
                  //-   v-select(v-model='v.cod_tipoutente', :readonly='v.contabilizzato', dense, label='Tipo Utente', :items="[{text:'(SB) Studente Bando', value: 'SB'},{text:'(AS) Altri Studenti', value: 'AS'},{text:'(OS) Ospitalita', value: 'OS'}]")
          //- v-card.my-2(outlined)
          //-   v-card-text
          //-     div Filtri Utente
          //-   v-icon.chevron(
          //-     style="position: absolute;right: 12pt; top:8pt;",
          //-     @click="expandCollapse(5)"
          //-   ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
          //-   v-expand-transition
          //-     div(v-show="expand_sections[5] === true")
          //-       v-row.mx-1.mt-0.py-0
          //-         v-col.py-0(cols="12", md="3")
          //-           v-checkbox.mt-0(
          //-             label="Handicap",
          //-             v-model="filters.handicap"
          //-           )
          v-card.my-2(outlined)
            v-card-text
              div Dati Pagamento
            v-icon.chevron(
              style="position: absolute;right: 12pt; top:8pt;",
              @click="expandCollapse(4)"
            ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
            v-expand-transition
              div(v-show="expand_sections[4] === true")
                v-row.mx-1.mt-3.py-0
                  v-col.py-0(cols="12", sm="6")
                    v-autocomplete(
                      v-model="v.cod_tipoutente",
                      :readonly="v.contabilizzato",
                      dense,
                      label="Tipo Utente",
                      :items="tipiUtente",
                      item-text="descrizione",
                      return-object
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-autocomplete(
                      v-model="v.id_tipo_rata",
                      :readonly="v.contabilizzato",
                      dense,
                      label="Tipo Rata",
                      :items="tipiRate",
                      item-text="descrizione",
                      item-value="id"
                    )

          v-card.my-2(outlined)
            v-card-text
              div Dati Appartamento
            v-icon.chevron(
              style="position: absolute;right: 12pt; top:8pt;",
              @click="expandCollapse(1)"
            ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
            v-expand-transition
              div(v-show="expand_sections[1] === true")
                v-row.mx-1.my-0.py-0
                  v-col.py-0
                    v-autocomplete(
                      return-object,
                      cache-items,
                      flat,
                      hide-no-data,
                      dense,
                      clearable,
                      label="Fabbricato",
                      :items="fabbricati",
                      :readonly="v.contabilizzato",
                      v-model="v.fabbricato",
                      item-text="desc",
                      item-value="id" 
                      solo-inverted,
                      prepend-icon="mdi-office-building"
                    )
                v-row.mx-1.mt-0.py-0(v-if="!!v.fabbricato")
                  v-col.py-0(cols="12")
                    v-text-field(
                      :value="v.fabbricato.indirizzo",
                      readonly,
                      dense,
                      label="Indirizzo"
                    )
                  v-col.py-0(cols="12", md="4")
                    v-text-field(
                      :value="v.fabbricato.comune",
                      readonly,
                      dense,
                      label="Comune'"
                    )
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      :value="v.fabbricato.provincia",
                      readonly,
                      dense,
                      label="Prov."
                    )
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      :value="v.fabbricato.cap",
                      readonly,
                      dense,
                      label="CAP"
                    )
                  v-dialog(v-model="filtriStanza", max-width="700px")
                    v-card
                      v-card-title.headline.font-weight-regular Stanza
                      .my-4.mx-6
                        v-card(outlined)
                          v-card-text
                            div
                              v-icon(left) mdi-filter-variant
                              | Filtri (Se non impostati non attivi)
                          .my-4.mx-6
                            v-row
                              v-col.py-0(cols="12", md="6")
                                v-autocomplete(
                                  label="Tipo Stanza",
                                  dense,
                                  clearable,
                                  :items="tipiStanze",
                                  v-model="filters.tipoStanza"
                                )
                              v-col.py-0(cols="12", md="6")
                                v-autocomplete(
                                  label="Sesso",
                                  dense,
                                  clearable,
                                  :items="['M', 'F']",
                                  v-model="filters.sesso"
                                )
                              v-col.py-0(cols="12", md="6")
                                v-checkbox(
                                  label="Doppia uso singolo",
                                  v-model="filters.doppiaUsoSingolo"
                                )
                              v-col.py-0(cols="12", md="3")
                                v-checkbox(
                                  label="Bagno",
                                  v-model="filters.bagno"
                                )
                              v-col.py-0(cols="12", md="3")
                                v-checkbox(
                                  label="Handicap",
                                  v-model="filters.handicap"
                                )
                        v-row 
                          v-col.mt-2
                            v-autocomplete(
                              v-model="v.stanza",
                              item-text="numero_stanza",
                              :items="filteredRooms",
                              dense,
                              :readonly="v.contabilizzato",
                              return-object,
                              label="Stanza con i filtri"
                            )
                      v-card-actions
                        v-spacer
                        v-btn(
                          @click="filtriStanza = false",
                          text,
                          color="primary darken-1"
                        ) Ok
                  v-col.py-0(cols="12", sm="6")
                    v-text-field(
                      label="Stanza",
                      placeholder="Clicca per selezionare",
                      dense,
                      @focus="filtriStanza = true",
                      v-model="numeroStanza",
                      @keydown="ignore"
                    )
                  v-col.py-0(
                    v-if="(v.stanza.presenza_bagno && v.stanza.presenza_bagno == 'S') || (v.stanza.handicap && v.stanza.handicap == 'S')",
                    cols="1"
                  )
                    v-icon(
                      v-if="v.stanza.presenza_bagno && v.stanza.presenza_bagno == 'S'",
                      desnse
                    ) mdi-toilet
                    v-icon(
                      v-if="v.stanza.handicap && v.stanza.handicap == 'S'",
                      desnse
                    ) mdi-wheelchair-accessibility
                  v-col.py-0
                    v-text-field(
                      :value="v.stanza.codice_unita_immobiliare",
                      readonly,
                      dense,
                      label="Unita' Immobiliare"
                    )
                  v-col.py-0(v-if="!!v.stanza.posto_letto")
                    v-checkbox.mt-0(
                      :readonly="v.contabilizzato",
                      dense,
                      label="Doppia uso singolo"
                    )
          v-card.my-2(outlined)
            v-card-text
              div Dati Contratto
            v-icon.chevron(
              style="position: absolute;right: 12pt; top:8pt;",
              @click="expandCollapse(2)"
            ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
            v-expand-transition
              div(v-show="expand_sections[2] === true")
                v-row.mx-1.my-0.py-0
                  v-col.pt-0
                    v-autocomplete(
                      cache-items,
                      flat,
                      hide-details,
                      dense,
                      label="Tipo Contratto",
                      solo-inverted,
                      :readonly="v.contabilizzato",
                      :items="tipiContratti",
                      item-text="desc_sigla",
                      item-value="id"
                      v-model="v.tipoContratto",
                      return-object,
                      prepend-icon="mdi-file-document-edit",
                      clearable
                    )
                v-row.mx-1.mt-3.py-0(v-if="!!v.tipoContratto")
                  v-col.py-0(cols="12")
                    v-text-field(
                      v-model="v.tipoContratto.descrizione",
                      readonly,
                      dense,
                      label="Descrizione"
                    )
                  v-col.py-0(cols="12", md="6")
                    v-text-field(
                      v-model="v.tipoContratto.canone",
                      readonly,
                      dense,
                      label="Tariffa Canone"
                    )
                  v-col.py-0(cols="12", md="6")
                    v-text-field(
                      v-model="v.tipoContratto.consumi",
                      readonly,
                      dense,
                      label="Tariffa Consumi"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-select(
                      v-model="v.tipoContratto.frequenza",
                      :items="frequenze",
                      readonly,
                      dense,
                      label="Frequenza Rate"
                    )
                  v-col.py-0(cols="12", sm="6")
                    v-autocomplete(
                      :items="anniAccademici",
                      v-model="v.annoContratto",
                      :readonly="v.contabilizzato",
                      dense,
                      label="Anno Accademico"
                    )
          v-card.my-2(outlined)
            v-card-text
              div Dati Importi
            v-icon.chevron(
              style="position: absolute;right: 12pt; top:8pt;",
              @click="expandCollapse(3)"
            ) mdi-chevron-{{ expand_sections[1] ? 'up' : 'down' }}
            v-expand-transition
              div(v-show="expand_sections[3] === true" v-if="v.tipoContratto")
                v-card-actions
                  v-btn.mx-4(@click="getTariffa") Calcola
                    v-icon mdi-refresh
                  v-alert.ma-2(v-if="noTariffaValid", type="error") Nessuna tariffa disponibile per i dati forniti
                v-row.mx-1
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      readonly,
                      dense,
                      label="Totale Canone",
                      v-model="totale_canone"
                    )
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      readonly,
                      dense,
                      label="Totale Consumi",
                      v-model="totale_consumi"
                    )                  
                v-row.mx-1
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      readonly,
                      dense,
                      label="Cauzione",
                      v-model="(isNaN(v.tipoContratto.cauzione)) ? 'Non specificato' : v.tipoContratto.cauzione"
                    )
                  v-col.py-0(cols="12", md="6")
                    v-text-field(
                      v-model="(v.tipoContratto.pagante_cauzione == null) ? 'Non specificato' : v.tipoContratto.pagante_cauzione",
                      readonly,
                      dense,
                      label="Pagante Cauzione"
                    )
                v-row.mx-1
                  v-col.py-0(cols="12", md="6")
                    v-text-field(
                      v-model="(v.tipoContratto.quietanziante == null) ? 'Non specificato' : v.tipoContratto.quietanziante",
                      readonly,
                      dense,
                      label="Quietanziante"
                    )
                  v-col.py-0(cols="12", sm="4")
                    v-text-field(
                      readonly,
                      dense,
                      label="Totale",
                      v-model="totale"
                      color="blue darken-2"
                    )
                  //- v-col.py-0(cols="12", sm="4")
                  //-   input-date-picker(
                  //-     readonly="v.contabilizzato",
                  //-     dense,
                  //-     label="Data Scadenza Cauzione"
                  //-   )
                  //- v-col.py-0(cols="12", sm="4")
                  //-   v-text-field(readonly, dense, label="Penale")
      v-tab-item.pa-2
        v-card-text ?
      v-tab-item.pa-2
        v-card-text ??
      v-tab-item.pa-2
        v-card-text ???
  v-card-actions
    v-spacer
    v-btn.primary(@click="submit", :disabled="!validDate") Invia
</template>

<script>
import Vue from "vue";
import moment from "moment";
export default {
  props: ["value", "fabbricati", "type", "tipi-contratti", "tipi-utente", "tipi-rate"],
  data() {
    return {
      expand_sections: [true, true, true, true, true, true],
      v: this.$props.value,
      frequenze: [
        {
          text: "M - Mensile",
          value: "M",
        },
        {
          text: "G - Giornaliera",
          value: "G",
        },
      ],
      notNullRule: [(v) => !!v || "Campo obbligatorio"],
      alloggi: [],
      filtriStanza: false,
      filters: {
        bagno: true,
        handicap: false,
        doppiaUsoSingolo: false,
        tipoStanza: "",
        sesso: "",
      },
      shouldFire: true,
      validDate: false,
      noTariffaValid: false,
      updateT: 0,
    };
  },
  computed: {
    deleteBtnText() {
      if (this.$props.type == "modifica") return "Elimina contratto";
      else return "Annulla inserimento";
    },
    anniAccademici() {
      return [...Array(new Date().getFullYear() - 2015 + 5).keys()].map((x) => {
        return `${2015 + x}/${2015 + x + 1}`;
      });
    },
    numeroStanza() {
      this.updateT;
      return this.v.stanza.numero_stanza ?? '';
    },
    filteredRooms() {
      return this.alloggi.filter((x) => {
        if (this.filters.bagno && x.presenza_bagno == "N") return false;
        if (this.filters.handicap && x.handicap == "N") return false;
        if (
          this.filters.tipoStanza &&
          x.id_tipo_stanza != this.filters.tipoStanza
        )
          return false;
        if (this.filters.doppiaUsoSingolo && x.id_tipo_stanza != 2)
          return false;
        return true;
      });
    },
    tipiStanze() {
      let tipi = this.alloggi.map((x) => {
        return {
          value: x.id_tipo_stanza,
          text: x.descrizione,
        };
      });
      return tipi.filter(function (v, i) {
        return tipi.indexOf(v) == i;
      });
    },
    totale_canone: {
      set(val) {
        this.$store.commit('inserimentoContratto/setImportoCanone', val);
      },
      get() {
        if (!this.v.tariffa) return "";
        var a = moment(this.v.fine),
        b = moment(this.v.inizio);
        var months = a.diff(b, 'months');
        b.add(months, 'months');
        var days = a.diff(b, 'days');
      
        return (
          Math.round(this.v.tariffa.prezzo_canone * months) + ((this.v.tariffa.prezzo_canone/30) * days)
        )
      }
    },
    totale_consumi: {
      set(val) {
        this.$store.commit('inserimentoContratto/setImportoConsumi', val);
      },
      get() {
        if (!this.v.tariffa) return "";
        var a = moment(this.v.fine),
        b = moment(this.v.inizio);
        var months = a.diff(b, 'months');
        b.add(months, 'months');
        var days = a.diff(b, 'days');
      
        return (
          Math.round(this.v.tariffa.prezzo_consumi * months) + ((this.v.tariffa.prezzo_consumi/30) * days)
        )
      }
    },
    totale() {
      this.updateT;
      if (!this.v.tariffa) return "";
      this.$store.commit('inserimentoContratto/setImportoConsumi', this.totale_consumi);
      this.$store.commit('inserimentoContratto/setImportoCanone', this.totale_canone);
      return (
        Number.parseFloat(this.totale_canone) +
        Number.parseFloat(this.totale_consumi) +
        Number.parseFloat(this.v.tipoContratto.cauzione)
      );
    },
  },
  watch: {
    "v.fabbricato": {
      handler(val) {
        if (val != null)
          this.updateAlloggi(val)
      },
      deep: true,
      immediate: true,
    },
    'filteredRooms': {
      handler(val){
        if (val.length == 0)
          this.v.stanza = ""
      }
    },
    'filters.sesso': {
      handler() {
        this.updateAlloggi(this.v.fabbricato)
      },
    },
    'filters.doppiaUsoSingolo': {
      handler(val) {
        if (val == true)
          this.v.id_utilizzo_stanza = 5;
        else
          this.v.id_utilizzo_stanza = -1;
        this.$emit("input", this.v);
      },
    },
    v: {
      handler(v, old) {
        if (!(old !== v)) this.$emit("input", v);
      },
      deep: true,
    },
    value: {
      handler(value) {
        this.v = value;
      },
      deep: true,
    },
  },
  methods: {
    updateAlloggi(val) {
      Vue.prototype.$api
        .get(
          `/fabbricati/${val.id}/alloggi?endDate=${this.v.fine}&startDate=${
            this.v.inizio
          }${this.filters.sesso ? `&mf=${this.filters.sesso}` : ""}`
        )
        .then(
          (res) => {
            this.alloggi = res.data;
          },
          (error) => {
            this.alloggi = [];
            console.error(error);
          }
        );
    },
    expandCollapse(i) {
      // this.expand_sections[i] = !this.expand_sections[i]
      // e' necessario aggiornare tutto l'array per invocare il ricalcolo del virtual-dom
      this.expand_sections = this.expand_sections.map((x, j) => {
        if(i == 3) this.getTariffa();
        if (i === j) return !x;
        else return x;
      });
    },
    deleteContract() {
      confirm("Sei sicuro di voler eliminare questo contratto?") &&
        setTimeout(() => {
          this.$store.dispatch("inserimentoContratto/deleteContract");
        });
    },
    ignore(event) {
      event.preventDefault();
    },
    submit() {
      if (this.type == "nuovo")
        this.$store.dispatch("inserimentoContratto/submit");
      else this.$store.dispatch("inserimentoContratto/submit", this.v);
    },
    getTariffa() {
      Vue.prototype.$api
        .get(
          `/ragioneria/tariffa?tipoUtente=${this.v.cod_tipoutente.id}&tipoStanza=${this.v.stanza.id_tipo_stanza}&tipoResidenza=${this.v.fabbricato.id_tipo_residenza}&frequenza=${this.v.tipoContratto.frequenza}`
        )
        .then(
          (res) => {
            if (res.data.length === 0) {
              this.noTariffaValid = true;
              return;
            }
            this.noTariffaValid = false;
            let tariffa = res.data.rows[0];
            this.v.tariffa = tariffa;
            this.$emit("input", this.v);
            this.updateT++;
          },
          (error) => {
            console.error(error);
          }
        );
    },
  },
};
</script>