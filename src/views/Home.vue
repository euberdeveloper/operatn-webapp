<template>
<v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app="app">
        <v-list shaped="shaped">
            <v-list-item-group v-model="tab">
                <v-list-item v-for="(item, i) in items" :key="i" @click="updateSelected(i)" :disabled="item.divider">
                    <v-subheader v-if="item.divider">{{item.role}}</v-subheader>
                    <v-divider v-if="item.divider"></v-divider>
                    <v-list-item-icon class="mr-3" v-if="!item.divider">
                        <v-icon dense="dense" v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content v-if="!item.divider">
                        <v-list-item-title v-text="item.text"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app="app" color="primary" dark="dark">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-0 pl-4" style="width: 300px"><span class="hidden-sm-and-down">CA Portineria Opera Univeristaria</span></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tooltip bottom="bottom"><template v-slot:activator="{ on }">
                <v-btn v-on="on" icon="icon" @click="changeTheme">
                    <v-icon>mdi-theme-light-dark</v-icon>
                </v-btn>
            </template><span>Cambia tema</span></v-tooltip>
        <v-tooltip bottom="bottom"><template v-slot:activator="{ on }">
                <v-btn v-on="on" icon="icon" @click="logout">
                    <v-icon>mdi-logout</v-icon>
                </v-btn>
            </template><span>Logout</span></v-tooltip>
        <v-btn icon="icon" large="large" @click="logo_click">
            <v-avatar style="background-color:white;" size="32px" item="item">
                <v-img :src="require('@/assets/logo_opera.png')" alt="Logo"></v-img>
            </v-avatar>
        </v-btn>
    </v-app-bar>
    <v-main class="ma-3">
        <transition name="slide-fade">
            <router-view :key="$route.path"></router-view>
        </transition>
    </v-main>
</v-app>

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
      if (k == "ADMIN" || k == "PORTINERIA")
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
      if (k == "SPORTELLO" || k == "ADMIN")
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
            icon: "mdi-file-document-edit", 
            text: "Ricerca contratti", 
            path: "/ricerca-contratti" },
          {
            icon: "mdi-account-multiple-check",
            text: "Presenze",
            path: "/presenze"
          },
        ]);
        items.push()
      if (k == "CONTROLLO_ALLOGGI" || k == "ADMIN")
        items = items.concat([
          { divider: true, role:'CONTROLLO ALLOGGI' },
          { icon: "mdi-spray-bottle", text: "Spese Servizi", path: "/spese-servizi" },
          { icon: "mdi-heart-broken", text: "Guasti", path: "/guasti" },
        ]);
      if (k == "ADMIN")
        items = items.concat([
          { divider: true, role:'ADMIN' },
          { icon: "mdi-account-supervisor-circle", text: "Gestione utenti", path: "/utenti" },
          { icon: "mdi-file-document-edit", text: "Gestione Firma", path: "/firmatario" },
        ]);
      if(k == "RAGIONERIA" || k == "ADMIN" || k == "SPORTELLO") {
        items = items.concat([
          { divider: true, role:'RAGIONERIA' },
          { icon: "mdi-file-document-edit", text: "Ricerca contratti", path: "/ricerca-contratti" },
          { icon: "mdi-email-multiple", text: "Ricerca bollette", path: "/bollette" },
        ]);
      }
      if (k == "SPORTELLO" || k == "ADMIN")
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
