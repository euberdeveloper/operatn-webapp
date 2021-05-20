<template>
  <operatn-base-menu :items="items" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import OperatnBaseMenu, { MenuItem } from '@/components/gears/bases/OperatnBaseMenu.vue';

@Component({
  components: {
    OperatnBaseMenu
  }
})
export default class MenuSportello extends Vue {
  /* DATA */

  private items: MenuItem[] = [
    {
      icon: "mdi-school",
      text: "Tipi studente",
      path: "/sportello/tipi-studente",
    },
    {
      icon: "mdi-note-text-outline",
      text: "Tipi contratto",
      path: "/sportello/tipi-contratto",
    },
    {
      icon: "mdi-office-building-outline",
      text: "Dipartimenti UNITN",
      path: "/sportello/dipartimenti-unitn",
    },
    {
      icon: "mdi-home-city",
      text: "Fabbricati",
      path: "/sportello/fabbricati",
    },
    {
      icon: "mdi-table-large",
      text: "Tabellone",
      path: "/sportello/tabellone",
    },
    {
      icon: "mdi-file-document-edit-outline",
      text: "Contratti",
      path: "/sportello/contratti",
    },
  ];
}
</script>