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
    },
    {
      icon: "mdi-account-heart",
      text: "Quietanzianti",
      path: "./quietanzianti",
    },
    {
      icon: "mdi-school",
      text: "Tipi studente",
      path: "./tipi-studente",
    },
    {
      icon: "mdi-circle-multiple",
      text: "Conti ricavi",
      path: "./conti-ricavi",
    },
    {
      icon: "mdi-calculator-variant",
      text: "Tipi tariffa",
      path: "./tipi-tariffa",
    },
    {
      icon: "mdi-account-box-multiple",
      text: "Tipi ospite",
      path: "./tipi-ospite",
    },
    {
      icon: "mdi-office-building-outline",
      text: "Dipartimenti UNITN",
      path: "./dipartimenti-unitn",
    }
  ];
}
</script>