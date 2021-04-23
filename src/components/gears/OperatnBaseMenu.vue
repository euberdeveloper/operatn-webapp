<template>
  <v-navigation-drawer v-model="showMenu" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-list shaped>
      <v-list-item-group v-model="tab">
        <v-list-item v-for="item of items" :key="item.path" :to="item.path">
          <v-list-item-icon class="mr-3">
            <v-icon dense>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MutationTypes } from "@/store";

export interface MenuItem {
  icon: string;
  text: string;
  path: string;
}

@Component
export default class OperatnBaseMenu extends Vue {
  /* PROPS */

  @Prop({ type: Array, required: true })
  private items!: MenuItem[];

  /* DATA */

  private tab = 0;

  /* COMPUTED */

  get showMenu(): boolean {
    return this.$store.state.showMenu;
  }
  set showMenu(value: boolean) {
    this.$store.commit(MutationTypes.SET_SHOW_MENU, value);
  }
}
</script>