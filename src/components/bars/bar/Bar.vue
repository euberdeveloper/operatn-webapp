<template>
  <v-app-bar color="primary" clipped-left dark app>
    <!-- HAMBURGER BOTTON -->
    <v-app-bar-nav-icon @click.stop="toggleMenu"></v-app-bar-nav-icon>

    <!-- TITLE -->
    <v-toolbar-title class="ml-0 pl-4">
      <span>OperaTN</span>
    </v-toolbar-title>

    <v-spacer />

    <!-- CHANGE THEME -->
    <v-tooltip bottom="bottom">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon="icon" @click="changeTheme">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </template>
      <span>Cambia tema</span>
    </v-tooltip>

    <!-- CHANGE PALETTE -->
    <v-menu ref="colourMenu" v-model="colourMenu" :close-on-content-click="false" left open-on-hover :nudge-bottom="28" transition="scale-transition" rounded="xl">
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" icon="icon" @click="changePalette">
          <v-icon>mdi-format-color-fill</v-icon>
        </v-btn>
      </template>
      <v-color-picker v-model="primaryColour" elevation="15" />
    </v-menu>

    <!-- SETTINGS MENU -->
    <v-menu ref="userMenu" v-model="userMenu" transition="scale-transition" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn v-on="on" v-bind="attrs" icon="icon">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" v-bind="attrs" v-on="on" class="mr-2">{{ $store.getters.roleIcon }}</v-icon>
                  </template>
                  <span>{{ $store.getters.role }}</span>
                </v-tooltip>
                <span>{{ $store.state.user.nomeUtente }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>{{ $store.state.user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider />

          <v-list-item @click="logout">
            <v-list-item-icon class="mr-3">
              <v-icon dense>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ActionTypes } from "@/store";

@Component
export default class Bar extends Vue {
  /* DATA */

  private colourMenu = false;
  private userMenu = false;

  /* COMPUTED */

  get primaryColour(): string | null {
    return this.$store.state.primaryColour;
  }
  set primaryColour(colour: string | null) {
    this.$store.dispatch(ActionTypes.CHANGE_PRIMARY_COLOUR, colour);
  }

  /* METHODS */

  toggleMenu(): void {
    this.$store.dispatch(ActionTypes.TOGGLE_MENU);
  }

  changeTheme(): void {
    this.$store.dispatch(ActionTypes.TOGGLE_DARK_THEME);
  }

  getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    return "#" + [...Array(6)].map(() => letters[Math.floor(Math.random() * 16)]).join("");
  }

  changePalette(): void {
    const colour = this.getRandomColor();
    this.$store.dispatch(ActionTypes.CHANGE_PRIMARY_COLOUR, colour);
  }

  logout(): void {
    this.$store.dispatch(ActionTypes.LOGOUT);
  }
}
</script>