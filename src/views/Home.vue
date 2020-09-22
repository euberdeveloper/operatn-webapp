<template lang="pug">
v-app#inspire
  v-navigation-drawer(v-model='drawer', :clipped='$vuetify.breakpoint.lgAndUp', app)
    v-list(shaped)
      v-list-item-group(v-model='tab')
        v-list-item(v-for='(item, i) in items', :key='i', @click='updateSelected(i)', :disabled='item.divider')
          v-subheader(v-if='item.divider') {{item.role}}
          v-divider(v-if='item.divider')
          v-list-item-icon.mr-3(v-if='!item.divider')
            v-icon(dense, v-text='item.icon')
          v-list-item-content(v-if='!item.divider')
            v-list-item-title(v-text='item.text')
  v-app-bar(:clipped-left='$vuetify.breakpoint.lgAndUp', app, color='primary', dark)
    v-app-bar-nav-icon(@click.stop='drawer = !drawer')
    v-toolbar-title.ml-0.pl-4(style='width: 300px')
      span.hidden-sm-and-down Portineria Opera Univeristaria
    v-spacer
    v-tooltip(bottom)
      template(v-slot:activator='{ on }')
        v-btn(v-on='on', icon, @click='changeTheme')
          v-icon mdi-theme-light-dark
      span Cambia tema
    v-tooltip(bottom)
      template(v-slot:activator='{ on }')
        v-btn(v-on='on', icon, @click='logout')
          v-icon mdi-logout
      span Logout
    v-btn(icon, large, @click='logo_click')
      v-avatar(style='background-color:white;', size='32px', item)
        v-img(:src="require('@/assets/logo_opera.png')", alt='Logo')
  v-main.ma-3
    transition(name='slide-fade')
      router-view(:key='$route.path')

</template>

<script>
import { mapState } from 'vuex';
const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    drawer: null,
    tab: 0,
  }),
  computed: {
    items () {
      let k = this.role;
      let items = [];
      if (k == 0 || k == 3)
        items = items.concat([
          { divider: true, role:'PORTINERIA' },
          {
            icon: "mdi-account-group",
            text: "Ricerca Ospiti",
            path: "/ricerca-ospiti"
          },
          { icon: "mdi-bed", text: "Occupazione stanze", path: "/stanze" },
          {
            icon: "mdi-file-document-edit",
            text: "Controlli",
            path: "/controlli"
          },
        ]);
      if (k == 1 || k == 3)
        items = items.concat([
          { divider: true, role:'SPORTELLO' },
          {
            icon: "mdi-account-group",
            text: "Ricerca Ospiti",
            path: "/ricerca-ospiti"
          },
          {
            icon: "mdi-account-details",
            text: "Gestione Anagrafica",
            path: "/aggiungi-persona"
          },
          {
            icon: "mdi-file-document-edit",
            text: "Inserimento Contratto",
            path: "/inserisci-contratto"
          },
          {
            icon: "mdi-account-multiple-check",
            text: "Presenze",
            path: "/presenze"
          },
        ]);
      if (k == 2 || k == 3)
        items = items.concat([
          { divider: true, role:'CONTROLLO ALLOGGI' },
          { icon: "mdi-spray-bottle", text: "Pulizie", path: "/pulizie" },
          { icon: "mdi-heart-broken", text: "Guasti", path: "/guasti" },
        ]);
      if (k == 3)
        items = items.concat([
          { divider: true, role:'ADMIN' },
          { icon: "mdi-account-supervisor-circle", text: "Gestione utenti", path: "/utenti" },
          { icon: "mdi-file-document-edit", text: "Gestione Firma", path: "/firmatario" },
        ]);
      if(k == 4 || k == 3 || k == 1) {
        items = items.concat([
          { divider: true, role:'RAGIONERIA' },
          { icon: "mdi-file-document-edit", text: "Ricerca contratti", path: "/ricerca-contratti" },
          { icon: "mdi-email-multiple", text: "Ricerca bollette", path: "/bollette" },
        ]);
      }
      if (k == 1 || k == 3)
        items = items.concat([
          { divider: true, role:'CONFIGURAZIONI' },
          {
            icon: "mdi-format-list-bulleted-type",
            text: "Tipi Contratto",
            path: "/inserimento-tariffa"
          },
          {
            icon: "mdi-school",
            text: "Tipi Studente",
            path: "/inserimento-tipo-studente"
          },
          { divider: true, role:'CONFIGURAZIONI TARIFFE' },
          {
            icon: "mdi-account-question",
            text: "Tipi Utente",
            path: "/inserimento-tipo-utente"
          },
          {
            icon: "mdi-cash-multiple",
            text: "Tipi Tariffe",
            path: "/tariffe"
          },
        ]);
      return items;
    },
    ...mapState('user', ['role'])
  },
  mounted () {
    this.tab = this.items.map(x => x.path).indexOf(this.$route.path)
    if (localStorage.getItem("darkTheme"))
      this.$vuetify.theme.dark = localStorage.getItem("darkTheme") == "true"
  },
  updated () {
    if (this.items.map(x => x.path).indexOf(this.$route.path) === -1) {
      if (this.$route.path == '/login' || this.$route.path == '/logout')
        return
      this.$router.replace(this.items[1].path)
      this.tab = 1
    }
  },
  methods: {
    updateSelected(i) {
      this.$router.replace(this.items[i].path);
    },
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$router.replace("/login")
        location.reload()
      })
      Object.keys(this.$store._modules.root._children).forEach(x=>{
        this.$store.commit(`${x}/resetState`)
      })
    },
    changeTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("darkTheme", this.$vuetify.theme.dark)
    },
    logo_click() {
      this.$vuetify.theme.themes.light.primary = getRandomColor()//#910830
      this.$vuetify.theme.themes.dark.primary = getRandomColor()
    }
  }
};
</script>
<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  position: absolute;
  transition: all 0.3s ease;
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>