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
export default class MenuAdmin extends Vue {
  /* DATA */

  private items: MenuItem[] = [
    {
      icon: "mdi-account-multiple",
      text: "Utenti",
      path: "/admin/utenti",
    },
    {
      icon: "mdi-home-group",
      text: "Tipi stanza",
      path: "/admin/tipi-stanza",
    },
    {
      icon: "mdi-home-city",
      text: "Tipi fabbricato",
      path: "/admin/tipi-fabbricato",
    },
    {
      icon: "mdi-account-heart",
      text: "Quietanzianti",
      path: "/admin/quietanzianti",
    },
    {
      icon: "mdi-school",
      text: "Tipi studente",
      path: "/admin/tipi-studente",
    },
    {
      icon: "mdi-circle-multiple",
      text: "Conti ricavi",
      path: "/admin/conti-ricavi",
    },
    {
      icon: "mdi-calculator-variant",
      text: "Tipi tariffa",
      path: "/admin/tipi-tariffa",
    },
    {
      icon: "mdi-account-box-multiple",
      text: "Tipi ospite",
      path: "/admin/tipi-ospite",
    },
    {
      icon: "mdi-note-text-outline",
      text: "Tipi contratto",
      path: "/admin/tipi-contratto",
    },
    {
      icon: "mdi-cash-multiple",
      text: "Tipi bolletta",
      path: "/admin/tipi-bolletta",
    },
    {
      icon: "mdi-office-building-outline",
      text: "Dipartimenti UNITN",
      path: "/admin/dipartimenti-unitn",
    },
    {
      icon: "mdi-currency-usd",
      text: "Tariffe",
      path: "/admin/tariffe",
    },
    {
      icon: "mdi-home-city",
      text: "Fabbricati",
      path: "/admin/fabbricati",
    },
    {
      icon: "mdi-table-large",
      text: "Tabellone",
      path: "/admin/tabellone",
    },
  ];
}
</script>