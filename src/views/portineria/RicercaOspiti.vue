<template lang="pug">
v-card
  v-card-title.headline.primary.white--text Contratti
  v-card-text
    v-subheader.pa-0 Scrivi il nomitativo dell'ospite per vedere il contratto
  v-card-text
    v-row.mx-2
      v-autocomplete(v-model='model', :items='items', :loading='isLoading', :search-input.sync='search', @input='search', hide-no-data='', hide-selected='', item-text='Description', item-value='API', label='Titolare contratto', placeholder='Inizia a scrivere per cercare', prepend-icon='mdi-card-account-details', return-object='', no-filter='', clearable='', :readonly='model != null')
  v-divider(v-if='model')
  v-expand-transition
    div(v-if='model')
      dettaglio-contratto(v-show='model', :model='model')
      v-row.mx-2.my-0.py-0(v-if='model')
        v-col.d-flex.justify-center
          v-btn.primary(@click='checkin', :disabled='!!model.check_in')
            v-icon(left='') mdi-calendar-arrow-left
            | Registra Check-In
          v-btn.ml-2.red.white--text(v-if='model.check_in', @click='getPDF')
            v-icon mdi-file-pdf
        v-col.d-flex.justify-center
          v-btn.primary(@click='checkout', :disabled='model.check_out || !model.check_in')
            v-icon(left='') mdi-calendar-arrow-right
            | Registra Check-Out
      v-row(v-if='model && can_discard')
        v-col.d-flex.justify-center
          v-btn.my-4(@click='undo_checkin', :disabled='!model.check_in || !!model.check_out')
            v-icon(left='') mdi-undo
            | Annulla check-in
        v-col.d-flex.justify-center
          v-btn.my-4(@click='undo_checkout', :disabled='!model.check_out || !model.check_in')
            v-icon(left='') mdi-undo
            | Annulla check-out
  v-card-actions
    v-spacer
    v-btn(v-if='model', @click='model=null')
      v-icon mdi-close
  v-dialog(v-if='confirm != null', v-model='confirm', max-width='350')
    v-card
      v-card-title.headline Confermare il {{confirm.action}}?
      v-card-text
        span
          | per registrare il
          b {{confirm.action}}
          |  di
          b {{model.nome + ' ' + model.cognome}}
          |  nel fabbricato
          b {{model.descrizione_fabbricato}}
          |  e nella stanza
          b {{model.numero_stanza}}
        v-container(fluid='', v-if="confirm.action == 'check-out'")
          | Ha consegnato:
          v-checkbox.py-0(v-model='consegna.lenzuola', label='Lenzuola')
          v-checkbox.py-0.mt-0(v-model='consegna.chiavi', label='Chiavi')
          v-checkbox.py-0.mt-0(v-model='consegna.badge', label='Badge')
      v-card-actions
        v-spacer
        v-btn(text='', @click='_discard') Annulla
        v-btn(color='primary darken-1', text='', @click='_confirm') Confermo

</template>

<script>
import { mapState, mapActions } from "vuex";
import pdfQuestura from "@/utils/pdfQuestura";
export default {
  data: () => ({
    search: null,
    consegna: {
      lenzuola: false,
      chiavi: false,
      badge: false
    }
  }),

  computed: {
    ...mapState("ricercaOspiti", {
      items: state =>
        state.entries.map(entry => {
          const Description = `${entry.cognome.trim()} ${entry.nome.trim()} ${entry.descrizione_fabbricato.trim()}`;
          return Object.assign({}, entry, { Description });
        }),
      isLoading: state => state.isLoading,
      confirm: state => state.confirm
    }),
    model: {
      get() {
        return this.$store.state.ricercaOspiti.model;
      },
      set(val) {
        this.$store.commit("ricercaOspiti/setModel", val);
      }
    },
    can_discard() {
      return (
        this.$store.state.user.role == 1 || this.$store.state.user.role == 3
      );
    }
  },
  methods: {
    ...mapActions("ricercaOspiti", [
      "checkin",
      "checkout", //lenzuola, badge, chiavi
      "_discard"
    ]),
    undo_checkin() {
      confirm("Sei sicuro di voler annullare il checkin?") &&
        this.$store.dispatch("ricercaOspiti/undo_checkin");
    },
    undo_checkout() {
      confirm("Sei sicuro di voler annullare il checkout?") &&
        this.$store.dispatch("ricercaOspiti/undo_checkout");
    },
    _confirm() {
      this.$store.commit("ricercaOspiti/setConsegna", this.consegna);
      this.$store.dispatch("ricercaOspiti/_confirm");
    },
    getPDF() {
      pdfQuestura(this.model)
    }
  },

  watch: {
    search(val) {
      if (!val || val.trim() == "" || !!this.model) return;
      val = val.trim();
      this.$store
        .dispatch("ricercaOspiti/search", val)
        .catch(err => console.error(err));
    },
    model() {
      let container = this.$el.querySelector("#dettaglio-contratto");
      if (container)
        container.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
};
</script>