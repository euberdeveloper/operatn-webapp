<template lang="pug">
v-data-table.elevation-2(:loading='loading', :search='search', :headers='headers', :items='people')
  template(v-slot:top='')
    v-toolbar(flat='')
      v-toolbar-title Firmatari
      v-spacer
      v-dialog(v-model='dialog', max-width='500px')
        template(v-slot:activator='{ on, attrs }')
          v-btn.mb-2(color='primary', dark='', v-bind='attrs', v-on='on') Aggiungi
        v-card
          v-card-title
            span.headline(v-if='newSigner.isNew') Registra firmatario
            span.headline(v-else='') Firma
          v-card-text
            v-container
              v-row(v-if='newSigner.isNew')
                v-col
                  user-select(item-value='id', prepend-icon='mdi-account', v-model='newSigner.ppl')
              v-row(v-if='newSigner.isNew')
                v-col
                  input-date-picker(label='Dal', v-model='newSigner.dal')
                v-col
                  input-date-picker(label='Al', v-model='newSigner.al')
              v-row
                v-col
                  v-file-input(v-if='newSigner.isNew', accept='image/*', v-model='newSigner.signature', label='Immagine firma con timbro')
                  v-img(v-if='!!newSigner.signatureSrc', :src='newSigner.signatureSrc')
          v-card-actions(v-if='newSigner.isNew')
            v-spacer
            v-btn(color='blue darken-1', text='', @click='close') Annulla
            v-btn(color='blue darken-1', text='', @click='save') Salva
    v-text-field.mx-3(v-model='search', append-icon='mdi-magnify', label='Cerca per username', single-line='', hide-details='')
  template(v-slot:item.actions='{ item }')
    v-chip(@click='view(item)')
      v-icon(small='', left='') mdi-eye
      | visualizza firma
    v-icon.ml-4(small='', v-if='item.ruolo != 3', @click='deleteSigner(item)') mdi-delete-forever

</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      search: "",
      page: 0,
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Cognome", value: "cognome" },
        { text: "Data di nascita", value: "data nascita" },
        { text: "Dal", value: "_dal" },
        { text: "Al", value: "_al" },
        { text: "", value: "actions", sortable: false }
      ],
      newSigner: {
        ppl: null,
        dal: "",
        al: "",
        signature: null,
        signatureSrc: null,
        isNew: true
      }
    };
  },
  computed: {
    ...mapState("firmatario", ["people", "loading"]),
    signature() {
      return this.newSigner.signature;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    signature(val) {
      if (!val) return;
      this.newSigner.signatureSrc = "";
      let reader = new FileReader();
      var vm = this;
      reader.onload = function(e) {
        vm.newSigner.signatureSrc = e.target.result;
      };
      reader.onerror = function(error) {
        alert(error);
      };
      reader.readAsDataURL(val);
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    ...mapActions('firmatario', ['deleteSigner']),
    view(item) {
      this.newSigner = {
        ppl: item.id,
        dal: item.dal,
        al: item.al,
        isNew: false,
        signature: null,
        signatureSrc: item.signature
      };
      this.dialog = true;
    },
    initialize() {
      this.$store.dispatch("firmatario/loadPeople");
    },
    close() {
      this.dialog = false;
      this.newSigner = {
        ppl: null,
        dal: "",
        al: "",
        isNew: true,
        signature: null,
        signatureSrc: null
      };
    },
    changePpl(val) {
      this.newSigner.ppl = val;
    },
    save() {
      this.$store.dispatch("firmatario/register", {
        id: this.newSigner.ppl,
        signature: this.newSigner.signatureSrc,
        dal: this.newSigner.dal,
        al: this.newSigner.al
      });
      this.close();
    }
  }
};
</script>