<template lang="pug">
v-data-table.elevation-1(:headers='headers', :items='tipiStudenti_', items-per-page='50', dense='')
  template(v-slot:top='')
    v-toolbar(flat='')
      v-toolbar-title Tipi Studenti
      v-spacer
      v-dialog(v-model='dialog', max-width='500px')
        template(v-slot:activator='{ on, attrs }')
          v-btn.mb-2(color='primary', dark='', v-bind='attrs', v-on='on') Aggiungi
        v-card
          v-card-title
            span.headline Nuovo Tipo Studente
          v-card-text
            v-container
              v-row
                v-col
                  v-text-field(v-model='nuovoTipo', label='Descrizione')
          v-card-actions
            v-spacer
            v-btn(color='blue darken-1', text='', @click='dialog = false') Annulla
            v-btn(color='blue darken-1', text='', @click='submit') Salva

</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
      tipiStudenti_: [],
      headers: ["id", "descrizione"].map(x => {
        return { text: x, value: x }
      }),
      dialog: false,
      nuovoTipo: ""
    };
  },
  computed: {
    tipiStudenti() {
      return this.tipiStudenti_.map(x => {
        return {
          text: `${x.descrizione}`,
          value: x.id
        };
      });
    }
  },
  mounted() {
    Vue.prototype.$api.get("/ragioneria/tipi/studenti").then(
      res => {
        this.tipiStudenti_ = res.data;
      },
      error => {
        this.tipiStudenti_ = [];
        console.error(error);
      }
    );
  },
  methods: {
    submit() {
      Vue.prototype.$api.post("/ragioneria/tipi/studenti", {
        desc: this.nuovoTipo
      }).then(
      res => {
        this.tipiStudenti_.push(res.data[0])
        this.nuovoTipo = ""
        this.dialog = false
      },
      error => {
        console.error(error)
      }
    )
    }
  }
};
</script>