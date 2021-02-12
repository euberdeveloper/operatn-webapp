<template lang="pug">
v-data-table.elevation-2(:loading='loading', :search='search', :headers='headers', :items='users')
  template(v-slot:top='')
    v-toolbar(flat='')
      v-toolbar-title Gestione Utenti
      v-spacer
      v-dialog(v-model='dialog', max-width='500px')
        template(v-slot:activator='{ on, attrs }')
          v-btn.mb-2(color='primary', dark='', v-bind='attrs', v-on='on') Nuovo Utente
        v-card
          v-card-title
            span.headline {{ formTitle }}
          v-card-text
            v-container
              v-row
                v-col
                  v-text-field(v-model='editedItem.username', label='Username')
                v-col
                  v-text-field(type='password', v-model='editedItem.password', label='Password')
              v-row
                v-col
                  | Ruolo:
                  v-radio-group(v-model='editedItem.ruolo', :mandatory='true')
                    v-radio(v-for='n in 5', :key='n', :label='getRole(n-1)', :value='n-1')
          v-card-actions
            v-spacer
            v-btn(color='primary darken-1', text='', @click='close') Annulla
            v-btn(:disabled='!canSave', color='primary darken-1', text='', @click='save') Salva
    v-text-field.mx-3(v-model='search', append-icon='mdi-magnify', label='Cerca per username', single-line='', hide-details='')
  template(v-slot:item.ruolo='{ item }')
    v-chip
      v-icon(small='', left='') {{getRoleIcon(item.ruolo)}}
      |         {{ getRole(item.ruolo) }}
  template(v-slot:item.actions='{ item }')
    v-icon.mr-2(small='', @click='editItem(item)') mdi-pencil
    v-icon(small='', v-if='item.ruolo != 3', @click='deleteItem(item)') mdi-delete-forever
  //
    <template v-slot:top>
    </template>

</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      search: "",
      headers: [
        { text: "Utente", value: "username" },
        { text: "Ruolo", value: "ruolo" },
        { text: "", value: "actions", sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        username: "",
        password: "",
        ruolo: 0
      },
      defaultItem: {
        username: "",
        password: "",
        ruolo: 0
      }
    };
  },
  computed: {
    ...mapState("gestioneUtenti", ["users", "loading"]),
    formTitle() {
      return this.editedIndex === -1 ? "Nuovo Utente" : "Modifica Utente";
    },
    canSave() {
      if (this.editedIndex === -1)
        return (
          this.editedItem.username &&
          this.editedItem.username.length > 0 &&
          this.editedItem.password &&
          this.editedItem.password.length > 0
        );
      else return true;
    }
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    getRole(num) {
      if (num == 0) return "Portineria";
      else if (num == 1) return "Sportello";
      else if (num == 2) return "Controllo alloggi";
      else if (num == 3) return "Admin";
      else if (num == 4) return "Ragioneria";
    },
    getRoleIcon(num) {
      if (num == 0) return "mdi-door-open";
      else if (num == 1) return "mdi-lifebuoy";
      else if (num == 2) return "mdi-tools";
      else if (num == 3) return "mdi-shield";
      else if (num == 4) return "mdi-office-building";
    },
    initialize() {
      this.$store.dispatch("gestioneUtenti/loadUsers");
    },
    editItem(item) {
      this.editedIndex = this.users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      confirm(`Sei sicuro di voler eliminare l'utente ${item.username}?`) &&
        this.$store.dispatch("gestioneUtenti/deleteUser", { id: item.id });
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        this.$store.dispatch(
          "gestioneUtenti/editUser",
          Object.assign(
            { id: this.users[this.editedIndex].id },
            this.editedItem
          )
        );
      } else {
        this.$store.dispatch(
          "gestioneUtenti/newUser",
          Object.assign({}, this.editedItem)
        );
      }
      this.close();
    }
  }
};
</script>