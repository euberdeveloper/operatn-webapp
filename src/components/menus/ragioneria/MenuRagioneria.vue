<template>
  <operatn-base-menu :items="items" />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import OperatnBaseMenu, { MenuItem } from "@/components/gears/bases/OperatnBaseMenu.vue";

@Component({
  components: {
    OperatnBaseMenu,
  },
})
export default class MenuRagioneria extends Vue {
  /* DATA */

  private items: MenuItem[] = [
    {
      icon: "mdi-account-heart",
      text: "Quietanzianti",
      path: "/ragioneria/quietanzianti",
    },

    {
      icon: "mdi-circle-multiple",
      text: "Conti ricavi",
      path: "/ragioneria/conti-ricavi",
    },
    {
      icon: "mdi-cash-multiple",
      text: "Tipi bolletta",
      path: "/ragioneria/tipi-bolletta",
    },
    {
      icon: "mdi-currency-usd",
      text: "Tariffe",
      path: "/ragioneria/tariffe",
    },
    {
      icon: "mdi-account-cash",
      text: "Contabilità",
      path: "/ragioneria/contabilita",
    },
  ];
}
</script>