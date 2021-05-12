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
      path: "/root/utenti",
    },
    {
      icon: "mdi-home-group",
      text: "Tipi stanza",
      path: "/root/tipi-stanza",
    },
    {
      icon: "mdi-home-city",
      text: "Tipi fabbricato",
      path: "/root/tipi-fabbricato",
    },
    {
      icon: "mdi-account-heart",
      text: "Quietanzianti",
      path: "/root/quietanzianti",
    },
    {
      icon: "mdi-school",
      text: "Tipi studente",
      path: "/root/tipi-studente",
    },
    {
      icon: "mdi-circle-multiple",
      text: "Conti ricavi",
      path: "/root/conti-ricavi",
    },
    {
      icon: "mdi-calculator-variant",
      text: "Tipi tariffa",
      path: "/root/tipi-tariffa",
    },
    {
      icon: "mdi-account-box-multiple",
      text: "Tipi ospite",
      path: "/root/tipi-ospite",
    },
    {
      icon: "mdi-note-text-outline",
      text: "Tipi contratto",
      path: "/root/tipi-contratto",
    },
    {
      icon: "mdi-cash-multiple",
      text: "Tipi bolletta",
      path: "/root/tipi-bolletta",
    },
    {
      icon: "mdi-office-building-outline",
      text: "Dipartimenti UNITN",
      path: "/root/dipartimenti-unitn",
    },
    {
      icon: "mdi-currency-usd",
      text: "Tariffe",
      path: "/root/tariffe",
    },
    {
      icon: "mdi-home-city",
      text: "Fabbricati",
      path: "/root/fabbricati",
    },
  ];
}
</script>