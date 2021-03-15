<template>
  <div>
    <v-expand-transition>
      <v-tabs :vertical="$vuetify.breakpoint.mdAndUp" center-active="center-active">
        <v-tab> <v-icon dense="dense" left="left">mdi-lock</v-icon>Prenotazione </v-tab>
        <v-tab> <v-icon dense="dense" left="left">mdi-plus</v-icon>Altri Dati </v-tab>
        <v-tab> <v-icon dense="dense" left="left">mdi-bike</v-icon>Biciclette </v-tab>
        <v-tab-item class="pa-2">
          <v-container>
            <v-form v-model="validDate">
              <v-row class="mx-2 mt-2">
                <v-col>
                  <input-date-picker
                    :readonly="v.contabilizzato"
                    v-model="v.inizio"
                    dense="dense"
                    label="Inizio"
                    :rules="notNullRule"
                    required="required"
                  ></input-date-picker>
                </v-col>
                <v-col>
                  <input-date-picker
                    :readonly="v.contabilizzato"
                    v-model="v.fine"
                    dense="dense"
                    label="Fine"
                    :rules="notNullRule"
                    required="required"
                  ></input-date-picker>
                </v-col>
                <v-col>
                  <input-date-picker v-if="v.contabilizzato" v-model="v.chiusura" dense="dense" label="Chiusura"></input-date-picker>
                  <v-btn class="red white--text" @click="deleteContract">
                    <v-icon left="left" dense="dense">mdi-delete-forever</v-icon>
                    {{ deleteBtnText }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <v-form v-if="validDate">
            <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Ospite</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(0)"
                >mdi-chevron-{{ expand_sections[0] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[0] === true">
                  <v-row class="mx-0 my-0 py-0">
                    <v-col class="py-0 px-0">
                      <user-select
                        return-object
                        hide-no-data="hide-no-data"
                        dense="dense"
                        prepend-icon="mdi-account"
                        v-model="v.persona"
                        :readonly="v.contabilizzato"
                        :start-date="v.inizio"
                        :end-date="v.fine"
                        :disabled="this.$props.type == 'modifica'"
                      ></user-select>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1 mt-3 py-0" v-if="!!v.persona">
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" v-model="v.persona.cognome" dense="dense" label="Cognome"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" dense="dense" v-model="v.persona.nome" label="Nome"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" dense="dense" v-model="v.persona.dataDiNascita" label="Data Nascita"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" dense="dense" v-model="v.persona.email" label="E-mail"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" dense="dense" v-model="v.persona.telefonoPrincipale" label="Telefono"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field readonly="readonly" dense="dense" v-model="v.persona.sesso" label="Sesso"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field
                        readonly="readonly"
                        dense="dense"
                        :value="`${v.persona.dipartimentoUnitn.codice} - ${v.persona.dipartimentoUnitn.sigla}`"
                        label="Cod. Dipartimento"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
            <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Pagamento</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(1)"
                >mdi-chevron-{{ expand_sections[1] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[1] === true">
                  <v-row class="mx-1 mt-3 py-0">
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="v.cod_tipoutente"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Tipo Utente"
                        :items="tipiUtente"
                        item-text="desc"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="v.id_tipo_rata"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Tipo Rata"
                        :items="tipiRate"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1 mt-3 py-0">
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="utilizzoStanza"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Utilizzo stanza"
                        :items="utilizziStanza"
                        item-text="desc"
                        return-object
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="tipoTariffa"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Tipo tariffa"
                        :items="tipiTariffa"
                        item-text="desc"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1 mt-3 py-0">
                    <v-col class="py-0" cols="12" sm="6">
                      <v-checkbox label="Checkout" v-model="checkout"></v-checkbox>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-checkbox label="Cauzione" v-model="cauzione"></v-checkbox>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
            <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Appartamento</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(2)"
                >mdi-chevron-{{ expand_sections[2] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[2] === true">
                  <v-row class="mx-1 my-0 py-0">
                    <v-col class="py-0">
                      <v-autocomplete
                        return-object
                        cache-items="cache-items"
                        flat="flat"
                        hide-no-data="hide-no-data"
                        dense="dense"
                        clearable="clearable"
                        label="Fabbricato"
                        :items="fabbricati"
                        :readonly="v.contabilizzato"
                        v-model="v.fabbricato"
                        item-text="desc"
                        item-value="id"
                        solo-inverted="solo-inverted"
                        prepend-icon="mdi-office-building"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1 mt-0 py-0" v-if="!!v.fabbricato">
                    <v-col class="py-0" cols="12">
                      <v-text-field :value="v.fabbricato.indirizzo" readonly="readonly" dense="dense" label="Indirizzo"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" md="4">
                      <v-text-field :value="v.fabbricato.comune" readonly="readonly" dense="dense" label="Comune'"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field :value="v.fabbricato.provincia" readonly="readonly" dense="dense" label="Prov."></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field :value="v.fabbricato.cap" readonly="readonly" dense="dense" label="CAP"></v-text-field>
                    </v-col>
                    <v-dialog v-model="filtriStanza" max-width="700px">
                      <v-card>
                        <v-card-title class="headline font-weight-regular">Stanza</v-card-title>
                        <div class="my-4 mx-6">
                          <v-card outlined="outlined">
                            <v-card-text>
                              <div><v-icon left="left">mdi-filter-variant</v-icon>Filtri (Se non impostati non attivi)</div>
                            </v-card-text>
                            <div class="my-4 mx-6">
                              <v-row>
                                <v-col class="py-0" cols="12" md="6">
                                  <v-autocomplete
                                    label="Tipo Stanza"
                                    dense="dense"
                                    clearable="clearable"
                                    :items="tipiStanze"
                                    v-model="filters.tipoStanza"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col class="py-0" cols="12" md="6">
                                  <v-autocomplete
                                    label="Sesso"
                                    dense="dense"
                                    clearable="clearable"
                                    :items="['MASCHIO', 'FEMMINA']"
                                    v-model="filters.sesso"
                                  ></v-autocomplete>
                                </v-col>
                                <v-col class="py-0" cols="12" md="6">
                                  <v-checkbox label="Doppia uso singolo" v-model="filters.doppiaUsoSingolo"></v-checkbox>
                                </v-col>
                                <v-col class="py-0" cols="12" md="3">
                                  <v-checkbox label="Bagno" v-model="filters.bagno"></v-checkbox>
                                </v-col>
                                <v-col class="py-0" cols="12" md="3">
                                  <v-checkbox label="Handicap" v-model="filters.handicap"></v-checkbox>
                                </v-col>
                              </v-row>
                            </div>
                          </v-card>
                          <v-row>
                            <v-col class="mt-2">
                              <v-autocomplete
                                v-model="stanzaSelezionata"
                                item-text="desc"
                                :items="postiLetto"
                                dense="dense"
                                :readonly="v.contabilizzato"
                                return-object
                                label="Stanza con i filtri"
                              ></v-autocomplete>
                            </v-col>
                          </v-row>
                        </div>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn @click="filtriStanza = false" text="text" color="primary darken-1">Ok</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-text-field
                        label="Stanza"
                        placeholder="Clicca per selezionare"
                        dense="dense"
                        @focus="filtriStanza = true"
                        v-model="numeroStanza"
                        @keydown="ignore"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      class="py-0"
                      v-if="(v.stanza.presenza_bagno &amp;&amp; v.stanza.presenza_bagno == 'S') || (v.stanza.handicap &amp;&amp; v.stanza.handicap == 'S')"
                      cols="1"
                    >
                      <v-icon v-if="v.stanza.presenza_bagno &amp;&amp; v.stanza.presenza_bagno == 'S'" desnse="desnse">mdi-toilet</v-icon>
                      <v-icon v-if="v.stanza.handicap &amp;&amp; v.stanza.handicap == 'S'" desnse="desnse">mdi-wheelchair-accessibility</v-icon>
                    </v-col>
                    <v-col class="py-0">
                      <v-text-field :value="stanzaSelezionata.unitaImmobiliare" readonly="readonly" dense="dense" label="Unita' Immobiliare"></v-text-field>
                    </v-col>
                    <v-col class="py-0" v-if="!!v.stanza.posto_letto">
                      <v-checkbox class="mt-0" :readonly="v.contabilizzato" dense="dense" label="Doppia uso singolo"></v-checkbox>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
            <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Contratto</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(3)"
                >mdi-chevron-{{ expand_sections[3] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[3] === true">
                  <v-row class="mx-1 mt-3 py-0">
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="tipoContratto"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Tipo Contratto"
                        :items="tipiContratti"
                        item-text="desc"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        v-model="quietanziante"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Quietanziante"
                        :items="quietanzianti"
                        item-text="desc"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card>
            <!-- <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Contratto</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(2)"
                >mdi-chevron-{{ expand_sections[1] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[2] === true">
                  <v-row class="mx-1 my-0 py-0">
                    <v-col class="pt-0">
                      <v-autocomplete
                        cache-items="cache-items"
                        flat="flat"
                        hide-details="hide-details"
                        dense="dense"
                        label="Tipo Contratto"
                        solo-inverted="solo-inverted"
                        :readonly="v.contabilizzato"
                        :items="tipiContratti"
                        item-text="desc_sigla"
                        item-value="id"
                        v-model="v.tipoContratto"
                        return-object
                        prepend-icon="mdi-file-document-edit"
                        clearable="clearable"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1 mt-3 py-0" v-if="!!v.tipoContratto">
                    <v-col class="py-0" cols="12">
                      <v-text-field v-model="v.tipoContratto.descrizione" readonly="readonly" dense="dense" label="Descrizione"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <v-text-field v-model="v.tipoContratto.canone" readonly="readonly" dense="dense" label="Tariffa Canone"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <v-text-field v-model="v.tipoContratto.consumi" readonly="readonly" dense="dense" label="Tariffa Consumi"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-select v-model="v.tipoContratto.frequenza" :items="frequenze" readonly="readonly" dense="dense" label="Frequenza Rate"></v-select>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                      <v-autocomplete
                        :items="anniAccademici"
                        v-model="v.annoContratto"
                        :readonly="v.contabilizzato"
                        dense="dense"
                        label="Anno Accademico"
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </div>
              </v-expand-transition>
            </v-card> -->
            <v-card class="my-2" outlined="outlined">
              <v-card-text>
                <div>Dati Importi</div>
              </v-card-text>
              <v-icon class="chevron" style="position: absolute; right: 12pt; top: 8pt" @click="expandCollapse(4)"
                >mdi-chevron-{{ expand_sections[4] ? "up" : "down" }}</v-icon
              >
              <v-expand-transition>
                <div v-show="expand_sections[4] === true">
                  <v-card-actions>
                    <v-alert class="ma-2" v-if="!tariffa" type="error">Nessuna tariffa disponibile per i dati forniti</v-alert>
                  </v-card-actions>
                  <v-row class="mx-1" v-if="tariffa">
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field readonly="readonly" dense="dense" label="Prezzo canoni" v-model="tariffa.prezzoCanoni"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field readonly="readonly" dense="dense" label="Prezzo consumi" v-model="tariffa.prezzoConsumi"> </v-text-field>
                    </v-col>
                  </v-row>
                  <!-- <v-row class="mx-1">
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field v-if="isNaN(v.tipoContratto.cauzione)" readonly="readonly" dense="dense" label="Cauzione" value="Non specificato"></v-text-field>
                      <v-text-field v-else readonly="readonly" dense="dense" label="Cauzione" v-model="v.tipoContratto.cauzione"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" md="6">
                      <v-text-field
                        v-if="v.tipoContratto.pagante_cauzione == null"
                        value="Non specificato"
                        readonly="readonly"
                        dense="dense"
                        label="Pagante Cauzione"
                      ></v-text-field>
                      <v-text-field v-else v-model="v.tipoContratto.pagante_cauzione" readonly="readonly" dense="dense" label="Pagante Cauzione"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1">
                    <v-col class="py-0" cols="12" md="6">
                      <v-text-field
                        v-if="v.tipoContratto.quietanziante === null"
                        value="Non specificato"
                        readonly="readonly"
                        dense="dense"
                        label="Quietanziante"
                      ></v-text-field>
                      <v-text-field v-else v-model="v.tipoContratto.quietanziante" readonly="readonly" dense="dense" label="Quietanziante"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="4">
                      <v-text-field readonly="readonly" dense="dense" label="Totale" v-model="totale" color="blue darken-2"></v-text-field>
                    </v-col>
                  </v-row> -->
                </div>
              </v-expand-transition>
            </v-card>
          </v-form>
        </v-tab-item>
        <v-tab-item class="pa-2">
          <v-card-text>?</v-card-text>
        </v-tab-item>
        <v-tab-item class="pa-2">
          <v-card-text>??</v-card-text>
        </v-tab-item>
        <v-tab-item class="pa-2">
          <v-card-text>???</v-card-text>
        </v-tab-item>
      </v-tabs>
    </v-expand-transition>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary" @click="submit" :disabled="!validDate">Invia</v-btn>
    </v-card-actions>
  </div>
</template>
<script>
import Vue from "vue";
import moment from "moment";
export default {
  props: ["value", "fabbricati", "tariffe", "type", "tipiTariffa", "utilizziStanza", "quietanzianti", "tipi-contratti", "tipi-utente", "tipi-rate"],
  data() {
    return {
      tipoContratto: "",
      utilizzoStanza: null,
      tipoTariffa: null,
      quietanziante: "",
      checkout: true,
      cauzione: true,
      expand_sections: [true, true, true, true, true, true],
      v: this.$props.value,
      stanzaSelezionata: {},
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
      tipiStanze: [],
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
    body() {
      return {
        dataInizio: this.v.inizio,
        dataFine: this.v.fine,
        idQuietanziante: this.quietanziante,
        idTariffa: this.tariffa?.id,
        idTipoContratto: this.tipoContratto,
        tipoRata: this.v.id_tipo_rata,
        cauzione: this.cauzione,
        checkout: this.checkout,
        ospiti: [
          {
            idOspite: this.v.persona.id,
            postiLetto: this.filters.doppiaUsoSingolo ? this.stanzaSelezionata.postiLetto.map(el => el.id) : [this.stanzaSelezionata.id],
          }
        ],
      };
    },
    postiLetto() {
      return this.filters.doppiaUsoSingolo
        ? this.alloggi.map((a) => ({ ...a, desc: `${a.unitaImmobiliare} - ${a.numeroStanza}` }))
        : this.alloggi.reduce((acc, curr) => {
            const postiLetto = curr.postiLetto.map((pl) => ({
              id: pl.id,
              unitaImmobiliare: curr.unitaImmobiliare,
              desc: `${curr.unitaImmobiliare} - ${curr.numeroStanza} - ${pl.postoLetto}`,
            }));
            acc.push(...postiLetto);
            return acc;
          }, []);
    },
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
      return this.v.stanza.numero_stanza ?? "";
    },
    tariffa() {
      console.log({
        idTipoOspite: this.v.cod_tipoutente?.id,
        idUtilizzoStanza: this.utilizzoStanza?.id,
        idTipoFabbricato: this.v.fabbricato?.idTipoFabbricato,
        idTipoTariffa: this.tipoTariffa,
      });
      return this.tariffe.find(
        (t) =>
          t.idTipoOspite == this.v.cod_tipoutente?.id &&
          t.idUtilizzoStanza == this.utilizzoStanza?.id &&
          t.idTipoFabbricato == this.v.fabbricato?.idTipoFabbricato &&
          t.idTipoTariffa == this.tipoTariffa
      );
    },
    totale_canone: {
      set(val) {
        this.$store.commit("inserimentoContratto/setImportoCanone", val);
      },
      get() {
        if (!this.v.tariffa) return "";
        var a = moment(this.v.fine),
          b = moment(this.v.inizio);
        var months = a.diff(b, "months");
        b.add(months, "months");
        var days = a.diff(b, "days");
        return Math.round(this.v.tariffa.prezzo_canone * months + (this.v.tariffa.prezzo_canone / 30) * days);
      },
    },
    totale_consumi: {
      set(val) {
        this.$store.commit("inserimentoContratto/setImportoConsumi", val);
      },
      get() {
        if (!this.v.tariffa) return "";
        var a = moment(this.v.fine),
          b = moment(this.v.inizio);
        var months = a.diff(b, "months");
        b.add(months, "months");
        var days = a.diff(b, "days");

        return Math.round(this.v.tariffa.prezzo_consumi * months) + (this.v.tariffa.prezzo_consumi / 30) * days;
      },
    },
    totale() {
      this.updateT;
      if (!this.v.tariffa) return "";
      this.$store.commit("inserimentoContratto/setImportoConsumi", this.totale_consumi);
      this.$store.commit("inserimentoContratto/setImportoCanone", this.totale_canone);
      return Number.parseFloat(this.totale_canone) + Number.parseFloat(this.totale_consumi) + Number.parseFloat(this.v.tariffa.cauzione);
    },
  },
  watch: {
    "v.fabbricato": {
      handler(val) {
        if (val != null && val.length !== 0) this.updateAlloggi(val);
      },
      deep: true,
      immediate: true,
    },
    "filters.bagno": {
      handler() {
        this.updateAlloggi(this.v.fabbricato);
      },
    },
    "filters.handicap": {
      handler() {
        this.updateAlloggi(this.v.fabbricato);
      },
    },
    "filters.tipoStanza": {
      handler() {
        this.updateAlloggi(this.v.fabbricato);
      },
    },
    "filters.sesso": {
      handler() {
        this.updateAlloggi(this.v.fabbricato);
      },
    },
    "filters.doppiaUsoSingolo": {
      handler(val) {
        if (val == true) this.v.id_utilizzo_stanza = 5;
        else this.v.id_utilizzo_stanza = -1;
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
  async mounted() {
    this.tipiStanze = (await Vue.prototype.$api.get(`/tipi-stanza`)).data.map((el) => ({ value: el.id, text: el.tipoStanza }));
  },
  methods: {
    async updateAlloggi(val) {
      try {
        let params = `dataInizio=${this.v.inizio}&dataFine=${this.v.fine}&idTipoStanza=${this.filters.tipoStanza}`;
        if (this.filters.bagno) params += `&bagno=true`;
        if (this.filters.handicap) params += `&handicap=true`;
        if (this.filters.doppiaUsoSingolo) params += `&doppiaUsoSingolo=true`;
        if (this.filters.sesso) params += `&sesso=${this.filters.sesso}`;
        const response = await Vue.prototype.$api.get(`/fabbricati/${val.id}/stanze/libere?${params}`);
        this.alloggi = response.data;
      } catch (error) {
        this.alloggi = [];
        console.error(error);
      }
    },
    expandCollapse(i) {
      // this.expand_sections[i] = !this.expand_sections[i]
      // e' necessario aggiornare tutto l'array per invocare il ricalcolo del virtual-dom
      this.expand_sections = this.expand_sections.map((x, j) => {
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
       this.$store.dispatch("inserimentoContratto/submit", this.body)
      // if (this.type == "nuovo") this.$store.dispatch("inserimentoContratto/submit");
      // else this.$store.dispatch("inserimentoContratto/submit", this.body);
    },
  },
};
</script>