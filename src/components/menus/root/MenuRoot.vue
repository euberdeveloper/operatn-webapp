<template>
  <operatn-base-menu :items="items" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import OperatnBaseMenu, { MenuItem } from '@/components/gears/OperatnBaseMenu.vue';

@Component({
  components: {
    OperatnBaseMenu
  }
})
export default class MenuRoot extends Vue {
  /* DATA */

  private items: MenuItem[] = [
    {
      icon: "mdi-account-multiple",
      text: "Utenti",
      path: "./utenti",
    },
    {
      icon: "mdi-home-group",
      text: "Tipi stanza",
      path: "./tipi-stanza",
    },
    {
      icon: "mdi-home-city",
      text: "Tipi fabbricato",
      path: "./tipi-fabbricato",
    }
  ];
}
</script>